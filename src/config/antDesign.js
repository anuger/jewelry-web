import {
    Button,
    Col,
    Row,
    Layout,
    FormModel,
    Icon,
    Input,
    InputNumber,
    Menu,
    Breadcrumb,
    Dropdown,
    Table,
    Divider,
    Modal,
    Switch,
    Select,
    Upload,
    Popconfirm,
    Popover,
    DatePicker,
    ConfigProvider,
    Badge,
    Tabs,
    Avatar,
    Statistic,
    Descriptions,
    Timeline,
    Radio,
    Checkbox,
    Card,
    message,
    Empty,
    Steps,
    Tooltip,
    Pagination, Spin, List,
} from "ant-design-vue";

const components = [
    Button,
    Col,
    Row,
    Layout,
    FormModel,
    Icon,
    Input,
    InputNumber,
    Menu,
    Breadcrumb,
    Dropdown,
    Table,
    Divider,
    Modal,
    Switch,
    Select,
    Upload,
    Popconfirm,
    Popover,
    DatePicker,
    ConfigProvider,
    Badge,
    Tabs,
    Avatar,
    Statistic,
    Descriptions,
    Timeline,
    Radio,
    Checkbox,
    Card,
    Empty,
    List,
    Pagination,
    Spin,
    Steps,
    Tooltip,
    message

];

export default (Vue) => {
    // 注册弹出窗
    Vue.prototype.$confirm = Modal.confirm
    // 注册toast
    Vue.prototype.$message = message
    components.forEach(Component => {
        Vue.use(Component)
    });
}
