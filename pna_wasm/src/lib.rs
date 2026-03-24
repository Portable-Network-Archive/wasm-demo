mod utils;

use std::io::{self, prelude::*};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

fn to_js_error(e: io::Error) -> JsValue {
    JsValue::from_str(&e.to_string())
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Entry(libpna::NormalEntry);

#[wasm_bindgen]
impl Entry {
    fn from(
        name: &str,
        data: &[u8],
        password: Option<&str>,
        encryption: Option<&str>,
    ) -> io::Result<Self> {
        let mut options = libpna::WriteOptions::builder();
        options.compression(libpna::Compression::ZStandard);
        match (password, encryption) {
            (Some(pw), Some(enc)) => {
                let algo = match enc {
                    "aes" => libpna::Encryption::Aes,
                    "camellia" => libpna::Encryption::Camellia,
                    other => {
                        return Err(io::Error::new(
                            io::ErrorKind::InvalidInput,
                            format!(
                                "Unsupported encryption algorithm: '{other}'. Use 'aes' or 'camellia'."
                            ),
                        ));
                    }
                };
                options
                    .encryption(algo)
                    .cipher_mode(libpna::CipherMode::CTR)
                    .password(Some(pw));
            }
            (None, None) => {}
            _ => {
                return Err(io::Error::new(
                    io::ErrorKind::InvalidInput,
                    "Password and encryption algorithm must both be provided or both be omitted.",
                ));
            }
        }
        let mut entry =
            libpna::EntryBuilder::new_file(libpna::EntryName::from_lossy(name), options.build())?;
        entry.write_all(data)?;
        Ok(Self(entry.build()?))
    }

    async fn read_file(f: &web_sys::File) -> Result<(String, Vec<u8>), JsValue> {
        let name = f.name();
        let array = JsFuture::from(f.array_buffer()).await?;
        let data = js_sys::Uint8Array::new(&array).to_vec();
        Ok((name, data))
    }

    pub async fn new(f: web_sys::File) -> Result<Entry, JsValue> {
        utils::set_panic_hook();
        let (name, data) = Self::read_file(&f).await?;
        Self::from(&name, &data, None, None).map_err(to_js_error)
    }

    pub async fn new_encrypted(
        f: web_sys::File,
        password: String,
        algorithm: String,
    ) -> Result<Entry, JsValue> {
        utils::set_panic_hook();
        let (name, data) = Self::read_file(&f).await?;
        Self::from(&name, &data, Some(&password), Some(&algorithm)).map_err(to_js_error)
    }

    pub fn name(&self) -> String {
        self.0.header().path().to_string()
    }

    pub fn is_encrypted(&self) -> bool {
        self.0.header().encryption() != libpna::Encryption::No
    }

    fn to_vec(&self, password: Option<String>) -> io::Result<Vec<u8>> {
        let mut reader = self
            .0
            .reader(libpna::ReadOptions::with_password(password))?;
        let mut data = Vec::new();
        reader.read_to_end(&mut data)?;
        Ok(data)
    }

    pub async fn extract(&self, password: Option<String>) -> Result<js_sys::Uint8Array, JsValue> {
        utils::set_panic_hook();
        let vec = self.to_vec(password).map_err(to_js_error)?;
        Ok(js_sys::Uint8Array::from(vec.as_slice()))
    }
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Entries(Vec<Entry>);

#[wasm_bindgen]
impl Entries {
    pub fn array(self) -> Vec<Entry> {
        self.0
    }
}

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Archive(Vec<u8>);

#[wasm_bindgen]
impl Archive {
    pub fn create(entries: Vec<Entry>) -> Self {
        utils::set_panic_hook();
        let vec = Vec::new();
        let mut archive = libpna::Archive::write_header(vec).unwrap();
        for pna_entry in entries {
            archive.add_entry(pna_entry.0).unwrap();
        }
        Self(archive.finalize().unwrap())
    }

    pub async fn from(f: web_sys::Blob) -> Self {
        utils::set_panic_hook();
        let array = JsFuture::from(f.array_buffer()).await.unwrap();
        let data = js_sys::Uint8Array::new(&array);
        Self(data.to_vec())
    }

    fn _entries(&self) -> io::Result<Vec<Entry>> {
        let mut archive = libpna::Archive::read_header(self.0.as_slice())?;
        let entries = archive
            .entries_skip_solid()
            .map(|it| it.map(Entry))
            .collect::<io::Result<Vec<_>>>()?;
        Ok(entries)
    }

    pub async fn entries(&self) -> Result<Entries, JsValue> {
        self._entries().map(Entries).map_err(to_js_error)
    }

    pub fn is_encrypted(&self) -> bool {
        self._entries()
            .map(|it| it.iter().any(|it| it.is_encrypted()))
            .unwrap_or(false)
    }

    pub async fn extract_to_entries(blob: web_sys::Blob) -> Result<Entries, JsValue> {
        Self::from(blob).await.entries().await
    }

    pub fn to_u8array(&self) -> js_sys::Uint8Array {
        js_sys::Uint8Array::from(self.0.as_slice())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    async fn pna_empty() {
        let entries = vec![];
        let archive = Archive::create(entries);
        let entries = archive.entries().await.unwrap().array();
        assert_eq!(entries.len(), 0);
    }

    #[wasm_bindgen_test]
    async fn pna() {
        let entries = vec![
            Entry::from("deflate.txt", b"wasm test!", None, None).unwrap(),
            Entry::from("empty.txt", b"", None, None).unwrap(),
        ];
        let archive = Archive::create(entries);
        assert!(!archive.is_encrypted());
        let mut entries = archive.entries().await.unwrap().array();
        let entry = entries.pop().unwrap();
        assert_eq!(entry.to_vec(None).unwrap().as_slice(), b"");
        let entry = entries.pop().unwrap();
        assert_eq!(entry.to_vec(None).unwrap().as_slice(), b"wasm test!");
    }

    #[wasm_bindgen_test]
    async fn pna_encrypted() {
        let password = "test_password";
        let entries =
            vec![
                Entry::from("secret.txt", b"encrypted data", Some(password), Some("aes")).unwrap(),
            ];
        let archive = Archive::create(entries);
        assert!(archive.is_encrypted());
        let mut entries = archive.entries().await.unwrap().array();
        let entry = entries.pop().unwrap();
        assert!(entry.is_encrypted());
        assert_eq!(
            entry.to_vec(Some(password.to_string())).unwrap().as_slice(),
            b"encrypted data"
        );
    }

    #[wasm_bindgen_test]
    async fn pna_encrypted_camellia() {
        let entries =
            vec![Entry::from("cam.txt", b"camellia", Some("pw"), Some("camellia")).unwrap()];
        let archive = Archive::create(entries);
        assert!(archive.is_encrypted());
        let entry = &archive.entries().await.unwrap().array()[0];
        assert_eq!(
            entry.to_vec(Some("pw".to_string())).unwrap().as_slice(),
            b"camellia"
        );
    }

    #[wasm_bindgen_test]
    async fn pna_encrypted_wrong_password() {
        let entries =
            vec![Entry::from("secret.txt", b"data", Some("correct"), Some("aes")).unwrap()];
        let archive = Archive::create(entries);
        let entry = &archive.entries().await.unwrap().array()[0];
        assert!(entry.to_vec(Some("wrong".to_string())).is_err());
    }

    #[wasm_bindgen_test]
    async fn pna_encrypted_invalid_algorithm() {
        let result = Entry::from("f.txt", b"data", Some("pw"), Some("blowfish"));
        assert!(result.is_err());
    }

    #[wasm_bindgen_test]
    async fn pna_encrypted_mismatched_args() {
        assert!(Entry::from("f.txt", b"data", Some("pw"), None).is_err());
        assert!(Entry::from("f.txt", b"data", None, Some("aes")).is_err());
    }
}
