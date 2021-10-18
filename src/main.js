import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import './assets/styles/layout.scss';

import { createApp, reactive } from 'vue'
import router from "./router";
import store from "./store";
import App from './App.vue'

// Import the Auth0 configuration
// import authConfig from '../auth_config.json'
// import { setupAuth } from './auth'

// Prime Vue stuff
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import Image from 'primevue/image';
import Password from 'primevue/password';
import ProgressBar from 'primevue/progressbar';
import RadioButton from 'primevue/radiobutton';
import Rating from 'primevue/rating';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import TextArea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Toolbar from 'primevue/toolbar';

const app = createApp(App)

app.use(router)
app.use(store)

app.config.globalProperties.$appState = reactive({ theme: 'saga-blue' });
app.use(PrimeVue, { ripple: true, inputStyle: 'outlined' })
app.use(ToastService);

app.component('Button', Button);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('FileUpload', FileUpload);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('Image', Image);
app.component('Password', Password);
app.component('ProgressBar', ProgressBar);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('Textarea', TextArea);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);

app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass)

// function callbackRedirect(appState) {
//   router.push(
//     appState && appState.targetUrl
//       ? appState.targetUrl
//       : '/'
//   );
// }

// setupAuth({
//   domain: process.env.VUE_APP_AUTH_DOMAIN,
//   client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
//   redirect_uri: process.env.VUE_APP_AUTH_REDIRECT_URI,
//   audience: process.env.VUE_APP_AUTH_AUDIENCE
// }, callbackRedirect).then((auth) => {
//   app.use(auth).mount('#app')
// })
app.mount('#app')
