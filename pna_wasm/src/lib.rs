mod utils;

use std::{
    io::{self, prelude::*},
    str::FromStr,
};
use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

// #[wasm_bindgen]
// pub fn greet(name: &str) {
//     utils::set_panic_hook();
//     alert(&format!("Hello {}", name));
// }

#[derive(Debug, PartialEq, Eq)]
struct PnaEntry {
    name: String,
    data: Vec<u8>,
}

#[wasm_bindgen]
pub fn create(entries: js_sys::Map) -> js_sys::Uint8Array {
    utils::set_panic_hook();
    let mut pna_entries = vec![];
    for maybe_key in entries.keys() {
        let key = maybe_key.unwrap();
        let d = entries.get(&key);
        let name = js_sys::JsString::unchecked_from_js(key);
        let name = String::from(name);
        let d = js_sys::Uint8Array::unchecked_from_js(d);
        let data = d.to_vec();
        let pna_entry = PnaEntry { name, data };
        pna_entries.push(pna_entry)
    }
    let data = _create(&pna_entries).unwrap();
    js_sys::Uint8Array::from(data.as_slice())
}

#[wasm_bindgen]
pub fn extract(archive: js_sys::Uint8Array) -> js_sys::Map {
    utils::set_panic_hook();
    let vec = archive.to_vec();
    let decoded = _extract(&vec).unwrap();
    let obj = js_sys::Map::new();
    for i in decoded {
        let key = js_sys::JsString::from_str(i.name.as_str()).unwrap();
        let data = js_sys::Uint8Array::from(i.data.as_slice());
        obj.set(&key, &data);
    }
    obj
}

fn _create(entries: &[PnaEntry]) -> io::Result<Vec<u8>> {
    let vec = Vec::new();
    let mut archive = libpna::Archive::write_header(vec)?;
    for pna_entry in entries {
        archive.add_entry({
            let mut entry = libpna::EntryBuilder::new_file(
                libpna::EntryName::from_lossy(&pna_entry.name),
                libpna::WriteOption::builder()
                    .compression(libpna::Compression::ZStandard)
                    .build(),
            )?;
            entry.write_all(&pna_entry.data)?;
            entry.build()?
        })?;
    }
    archive.finalize()
}

fn _extract(archive: &[u8]) -> io::Result<Vec<PnaEntry>> {
    let mut archive = libpna::Archive::read_header(archive)?;
    archive
        .entries()
        .map(|maybe_entry| {
            let entry = maybe_entry?;
            let name = entry.header().path().as_str().to_owned();
            let mut reader = entry.into_reader(libpna::ReadOption::builder().build())?;
            let mut data = Vec::new();
            io::copy(&mut reader, &mut data)?;
            Ok(PnaEntry { name, data })
        })
        .collect::<Result<_, _>>()
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn pna() {
        let entries = vec![PnaEntry {
            name: "pna_entry.txt".to_owned(),
            data: b"wasm test!".to_vec(),
        }];
        let archive = _create(&entries).unwrap();
        assert_eq!(entries, _extract(&archive).unwrap());
    }
}
