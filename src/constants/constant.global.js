// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://asl-backend-61e36445de89.herokuapp.com';
const DOCUMENT_ROOT = BASE_URL + '/docs/generated/';
const CUSTOMER = BASE_URL + '/api/customer';
const CUSTOMER_DESC = BASE_URL + '/api/customer_description';
const TEMPLATE = BASE_URL + '/api/template';
const TEMPLATE_ACTIVE = BASE_URL + '/api/template/active';
const EMPLOYEE_LOGIN = BASE_URL + '/api/employee/login';
const TRANSACTION = BASE_URL + '/api/transaction';
const TRANSACTION_OPEN = BASE_URL + '/api/transaction/open';
const TRANSACTION_INVOICE = BASE_URL + '/api/transaction/invoice';
const REVISION = BASE_URL + '/api/revision';
const EMPLOYEE = BASE_URL + '/api/employee';
const DOCUMENT = BASE_URL + '/api/document';

export {
  BASE_URL,
  DOCUMENT_ROOT,
  CUSTOMER,
  CUSTOMER_DESC,
  TEMPLATE,
  TEMPLATE_ACTIVE,
  TRANSACTION,
  TRANSACTION_OPEN,
  TRANSACTION_INVOICE,
  REVISION,
  EMPLOYEE,
  EMPLOYEE_LOGIN,
  DOCUMENT
}
