import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import './assets/styles/layout.scss';

import { createApp, reactive } from 'vue'
import router from "./router";
import store from "./store";
import App from './App.vue'

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
import RadioButton from 'primevue/radiobutton';
import Rating from 'primevue/rating';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import TextArea from 'primevue/textarea';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';

const app = createApp(App)

app.use(router)
app.use(store)

app.config.globalProperties.$appState = reactive({ theme: 'saga-blue' });
app.use(PrimeVue, { ripple: true, inputStyle: 'outlined' })

app.component('Button', Button);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('FileUpload', FileUpload);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('Textarea', TextArea);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);

app.directive('ripple', Ripple)
app.directive('styleclass', StyleClass)

app.mount('#app')
