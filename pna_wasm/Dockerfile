FROM ghcr.io/webassembly/wasi-sdk:latest

RUN apt-get update && apt-get install -y curl npm && npm install -g n && n install lts

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal --target wasm32-unknown-unknown

ENV PATH="/root/.cargo/bin:$PATH"

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

ENTRYPOINT [ "/root/.cargo/bin/wasm-pack" ]
