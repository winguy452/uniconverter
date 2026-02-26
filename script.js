<script src="https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/ffmpeg.min.js"></script>

const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: true });

async function convertFile() {
  const fileInput = document.getElementById("fileInput");
  const format = document.getElementById("format").value;
  const status = document.getElementById("status");

  if (!fileInput.files.length) {
    status.innerText = "Select a file first!";
    return;
  }

  const file = fileInput.files[0];

  status.innerText = "Loading converter...";
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));

  status.innerText = "Converting...";

  const output = "output." + format;

  await ffmpeg.run("-i", file.name, output);

  const data = ffmpeg.FS("readFile", output);

  const url = URL.createObjectURL(
    new Blob([data.buffer])
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = output;
  a.click();

  status.innerText = "Done!";
}
