const { body } = require('express-validator');

const notValidFields = [
    body("user_id")
      .not()
      .exists()
      .withMessage('user_id cannot be modified'),

    body("id")
      .not()
      .exists()
      .withMessage('id cannot be modified'),

    body("created_at")
      .not()
      .exists()
      .withMessage('created_at cannot be modified'),

    body("updated_at")
      .not()
      .exists()
      .withMessage('updated_at cannot be modified'),
];

module.exports = notValidFields;