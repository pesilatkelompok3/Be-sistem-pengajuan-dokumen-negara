'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const questionDummy = [
      {
        id: "form-111",
        form_id: "form-123",
        title_field: "Nama Lengkap Bayi",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-112",
        form_id: "form-123",
        title_field: "Tempat dan Tanggal Lahir",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-113",
        form_id: "form-123",
        title_field: "Jenis Kelamin",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-113",
        form_id: "form-123",
        title_field: "Nama Orang Tua",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-114",
        form_id: "form-123",
        title_field: "Kewarnanegaraan",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-115",
        form_id: "form-123",
        title_field: "Agama",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-116",
        form_id: "form-123",
        title_field: "Pekerjaan orang tua bayi",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-117",
        form_id: "form-123",
        title_field: "Alamat tempat tinggal",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-118",
        form_id: "form-123",
        title_field: "Nomor kartu Keluarga",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-119",
        form_id: "form-123",
        title_field: "NIK orang tua bayi",
        type: "short-text",
        required: "1",
      },
      {
        id: "form-120",
        form_id: "form-123",
        title_field: "Surat Nikah",
        type: "image-upload",
        required: "1",
      },
      {
        id: "form-121",
        form_id: "form-123",
        title_field: "Surat Keterangan Lahir",
        type: "image-upload",
        required: "1",
      },
      {
        id: "form-122",
        form_id: "form-123",
        title_field: "KTP orang tua bayi",
        type: "image-upload",
        required: "1",
      },
    ];
    await queryInterface.bulkInsert("Questions", questionDummy);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
