import http from "./http-common";

class UploadFilesService {
  upload(file, name, onUploadProgress, token) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      onUploadProgress,
      data: { name },
    });
  }
}

export default new UploadFilesService();
