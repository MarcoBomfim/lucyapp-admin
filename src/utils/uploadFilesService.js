import http from "./http-common";

class UploadFilesService {
  upload(file, name, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
      data: { name },
    });
  }
}

export default new UploadFilesService();
