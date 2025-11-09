# Dev Containers — Troubleshooting

This guide helps you create, repair, and optimize the VS Code Dev Container for this repo. It is tailored for Linux/WSL setups and Docker Desktop.

## Quick start

1. Prerequisites
   - Docker running and using a Linux engine (WSL2 recommended)
   - VS Code Dev Containers extension installed
   - Enough resources (4+ vCPU, 6–8 GB RAM recommended)

2. Open in container
   - VS Code: Command Palette → "Dev Containers: Rebuild Container"
   - Or click "Reopen in Container" if prompted

3. First-time checks (inside container)
```bash
# Validate Gradle wrapper and Java
./gradlew --version
java -version
```

## Best practices used in this repo

- Use named volumes for build caches
  - ~/.gradle → volume: `vscode-gradle`
  - ~/.m2 → volume: `vscode-m2`
  - Why: faster I/O on WSL, portable across machines, avoids host path issues
- Avoid host binds for personal config by default (.gitconfig, .ssh, .config/gh)
  - If you must bind, ensure the host paths exist first (see error fixes below)

## Rebuild and clear caches

If you changed `.devcontainer/devcontainer.json` or see stale mount options being used, force a clean rebuild:

```bash
# Stop and remove old containers/images for this workspace
# (run on your host shell)
docker ps -a --filter "label=devcontainer.local_folder" --format "{{.ID}}" | xargs -r docker rm -f

docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" \
  | grep -E "^vsc-.*devopsvanilla-morpheus-dashboards" \
  | awk '{print $2}' | xargs -r docker rmi -f

# Optional: clear temporary devcontainer feature cache
rm -rf /tmp/devcontainercli-*/container-features/* 2>/dev/null || true

# Rebuild
# VS Code → Command Palette → "Dev Containers: Rebuild Container"
```

## Verify volumes exist

```bash
docker volume ls | grep -E "(vscode-gradle|vscode-m2)"
```

If they don’t exist, Docker will create them automatically when the container starts.

## Common errors and fixes

### 1) invalid mount config for type "bind": bind source path does not exist: /.gitconfig

Symptom (from Docker):
```
invalid mount config for type "bind": bind source path does not exist: /.gitconfig
```

Cause:
- Stale/cached config still trying to bind host config files (.gitconfig/.ssh/.config/gh) with a wrong HOME expansion or paths that don’t exist.

Fix:
- Prefer the default setup (no binds for personal config)
- Clean containers/images (see Rebuild and clear caches above)
- If you must bind, create the host paths first:

```bash
mkdir -p ~/.ssh ~/.config/gh
[ -f ~/.gitconfig ] || touch ~/.gitconfig
```

Then add binds back in `devcontainer.json` (only if truly needed).

### 2) Docker daemon not reachable (Windows/WSL)

Symptoms:
- `error during connect: Get "http://.../version": The system cannot find the file specified.`

Fix:
- Start Docker Desktop
- Enable WSL2 integration for your Linux distro
- Use a Linux engine/context

```bash
docker context ls
docker version
```

### 3) Permission issues on ~/.m2 or ~/.gradle inside container

Symptoms:
- `Permission denied` writing to `/home/vscode/.m2` or `.gradle`

Fix: ensure ownership for user `vscode` after first start (add to `postCreateCommand` if needed):
```bash
sudo chown -R vscode:vscode /home/vscode/.m2 /home/vscode/.gradle || true
```

### 4) Slow performance on WSL with host binds

Cause:
- File I/O across Windows↔Linux boundaries is slow

Fix:
- Use named volumes for caches (`vscode-m2`, `vscode-gradle`) — already configured
- Avoid binds for large/volatile directories

### 5) Warning: InvalidDefaultArgInFrom (updateUID.Dockerfile)

Symptoms:
- Build warning: `InvalidDefaultArgInFrom: Default value for ARG $BASE_IMAGE ...`

Notes:
- This is a benign warning from the Dev Containers UID update helper image and can be safely ignored.

### 6) userEnvProbe taking long

Symptoms in log:
- `userEnvProbe is taking longer than 10 seconds`

Fix:
- Avoid long-running commands or prompts in your shell startup files (`~/.bashrc`, `~/.profile`)
- Prefer non-interactive checks in those files

## Git and SSH inside the container

If you did not bind host configs, configure them in the container:
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

mkdir -p ~/.ssh && chmod 700 ~/.ssh
# Paste/copy your keys as needed, then
chmod 600 ~/.ssh/id_rsa 2>/dev/null || true
```

## Appendix: Why named volumes for caches?

- Better performance on WSL/multi-OS
- No dependency on host directory existence
- Avoids accidental cache corruption across platforms
- Still persists across container rebuilds
