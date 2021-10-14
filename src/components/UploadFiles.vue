<template>
<div>
  <!-- <div>HEERE</div> -->
  <!-- <progress-bar :percentage="progress" /> -->
  <!-- <div>HEERE</div> -->

  <label class="btn btn-default">
    <input type="file" ref="file" @change="selectFile" />
  </label>

  <v-btn class="btn btn-success" :disabled="!selectedFiles" @click="upload">
    Upload
  </v-btn>

  <div class="alert alert-light" role="alert">{{ message }}</div>
</div>
</template>

<script>
import UploadService from "@/utils/uploadFilesService";

export default {
  name: "upload-files",
  components: {
    ProgressBar,
  },
  data() {
    return {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",

      fileInfos: [],
    };
  },
  methods: {
    selectFile() {
      debugger;
      this.selectedFiles = this.$refs.file.files;
    },
    upload() {
      this.progress = 0;

      this.currentFile = this.selectedFiles.item(0);
      UploadService.upload(this.currentFile, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then((response) => {
          this.message = response.data.message;
          return UploadService.getFiles();
        })
        .then((files) => {
          this.fileInfos = files.data;
        })
        .catch(() => {
          this.progress = 0;
          this.message = "Could not upload the file!";
          this.currentFile = undefined;
        });

      this.selectedFiles = undefined;
    },
  },
  mounted() {
    // UploadService.getFiles().then((response) => {
    //   this.fileInfos = response.data;
    // });
  },
};
</script>
