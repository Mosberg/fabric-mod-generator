export class DownloadManager {
  downloadFile(content, filename) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadProjectZip(files, filename) {
    // Simple multi-file download (browser limitation: one file at a time)
    // For production ZIP, user can select "Export Full Project" which creates folder structure
    const allContent = Object.entries(files)
      .map(
        ([path, content]) =>
          `// === ${path} ===\n${content}\n\n${"=".repeat(80)}\n\n`
      )
      .join("");

    this.downloadFile(allContent, filename.replace(".zip", ".java"));
  }
}
