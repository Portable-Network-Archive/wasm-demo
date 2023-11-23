mod utils;

use std::io::{self, prelude::*};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

// #[wasm_bindgen]
// pub fn greet(name: &str) {
//     utils::set_panic_hook();
//     alert(&format!("Hello {}", name));
// }

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Entry(libpna::RegularEntry);

#[wasm_bindgen]
impl Entry {
    fn from(name: &str, data: &[u8]) -> io::Result<Self> {
        let mut entry = libpna::EntryBuilder::new_file(
            libpna::EntryName::from_lossy(name),
            libpna::WriteOption::builder()
                .compression(libpna::Compression::ZStandard)
                .build(),
        )?;
        entry.write_all(data)?;
        Ok(Self(entry.build()?))
    }

    pub async fn new(f: web_sys::File) -> Result<Entry, JsValue> {
        utils::set_panic_hook();
        let name = f.name();
        let array = JsFuture::from(f.array_buffer()).await?;
        let data = js_sys::Uint8Array::new(&array).to_vec();
        Self::from(&name, &data).map_err(|_| JsValue::UNDEFINED)
    }

    pub fn name(&self) -> String {
        self.0.header().path().to_string()
    }

    fn into_vec(self) -> io::Result<Vec<u8>> {
        let mut reader = self.0.into_reader(libpna::ReadOption::builder().build())?;
        let mut data = Vec::new();
        reader.read_to_end(&mut data)?;
        Ok(data)
    }

    pub async fn extract(self) -> Result<js_sys::Uint8Array, JsValue> {
        utils::set_panic_hook();
        let vec = self.into_vec().map_err(|_| JsValue::UNDEFINED)?;
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

    fn _entries(&self) -> io::Result<Entries> {
        let mut archive = libpna::Archive::read_header(self.0.as_slice())?;
        let entries = archive
            .entries()
            .map(|it| it.map(Entry))
            .collect::<io::Result<Vec<_>>>()?;
        Ok(Entries(entries))
    }

    pub async fn entries(&self) -> Result<Entries, JsValue> {
        self._entries().map_err(|_| JsValue::UNDEFINED)
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
    async fn pna() {
        let entries = vec![Entry::from("pna_entry.txt", b"wasm test!").unwrap()];
        let archive = Archive::create(entries.clone());
        let entry = archive.entries().await.unwrap().array().pop().unwrap();
        assert_eq!(entry.into_vec().unwrap().as_slice(), b"wasm test!");
    }
}
