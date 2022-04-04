
import {
  Pagination,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Form,
  Carousel,
  CarouselItem,
  Scrollbar,
  Avatar,
  Slider,
} from 'element-ui';

export default {
  install(Vue) {
    Vue.use(Pagination);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Tooltip);
    Vue.use(Form);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Scrollbar);
    Vue.use(Avatar);
    Vue.use(Slider);
  }
}