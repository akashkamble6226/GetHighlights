const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const backendRoot = path.resolve(__dirname, '..');
const modelName = process.env.WHISPER_MODEL || 'tiny.en';
const modelFileName = `ggml-${modelName}.bin`;
const modelRootPath = process.env.WHISPER_MODEL_ROOT
  ? path.resolve(process.env.WHISPER_MODEL_ROOT)
  : path.join(backendRoot, 'models');
const modelPath = path.join(modelRootPath, modelFileName);
const whisperCppRoot = path.join(
  backendRoot,
  'node_modules',
  'nodejs-whisper',
  'cpp',
  'whisper.cpp',
);
const downloadScript = path.join(
  whisperCppRoot,
  'models',
  process.platform === 'win32'
    ? 'download-ggml-model.cmd'
    : 'download-ggml-model.sh',
);

function run(command, args, cwd) {
  console.log(`[prepare:whisper] ${command} ${args.join(' ')}`);

  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} failed with exit code ${result.status}`);
  }
}

function hasWhisperCli() {
  const executableName = process.platform === 'win32' ? 'whisper-cli.exe' : 'whisper-cli';
  const possiblePaths = [
    path.join(whisperCppRoot, 'build', 'bin', executableName),
    path.join(whisperCppRoot, 'build', 'bin', 'Release', executableName),
    path.join(whisperCppRoot, 'build', 'bin', 'Debug', executableName),
    path.join(whisperCppRoot, 'build', executableName),
    path.join(whisperCppRoot, executableName),
  ];

  return possiblePaths.some((executablePath) => fs.existsSync(executablePath));
}

function getCmakeConfigureArgs() {
  const args = ['-B', 'build'];

  if (process.env.WHISPER_WITH_CUDA === 'true') {
    args.push('-DGGML_CUDA=1');
  }

  const extraCmakeArgs = process.env.NODEJS_WHISPER_CMAKE_ARGS?.trim();

  if (extraCmakeArgs) {
    args.push(...extraCmakeArgs.split(/\s+/));
  }

  return args;
}

fs.mkdirSync(modelRootPath, { recursive: true });

if (fs.existsSync(modelPath)) {
  console.log(`[prepare:whisper] Model already exists at ${modelPath}`);
} else {
  if (!fs.existsSync(downloadScript)) {
    throw new Error(`nodejs-whisper downloader was not found at ${downloadScript}`);
  }

  if (process.platform === 'win32') {
    run(downloadScript, [modelName, modelRootPath], path.dirname(downloadScript));
  } else {
    run('sh', [downloadScript, modelName, modelRootPath], path.dirname(downloadScript));
  }
}

if (hasWhisperCli()) {
  console.log('[prepare:whisper] whisper-cli already exists');
} else {
  run('cmake', getCmakeConfigureArgs(), whisperCppRoot);
  run('cmake', ['--build', 'build', '--config', 'Release'], whisperCppRoot);
}
