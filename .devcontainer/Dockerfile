FROM mcr.microsoft.com/devcontainers/typescript-node:20-bookworm

# Install Rust toolchain, wasm target, and wasm-pack for building pna_wasm
RUN apt-get update \
 && apt-get install -y --no-install-recommends pkg-config libssl-dev curl ca-certificates clang \
 && rm -rf /var/lib/apt/lists/* \
 && su node -c "curl https://sh.rustup.rs -sSf | sh -s -- -y --profile minimal" \
 && su node -c "/home/node/.cargo/bin/rustup target add wasm32-unknown-unknown" \
 && su node -c "/home/node/.cargo/bin/cargo install wasm-pack --version 0.12.1" \
 && echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> /home/node/.bashrc \
 && echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> /home/node/.zshrc

USER node
WORKDIR /workspaces/wasm-demo
