import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import objectPath from "object-path";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  token: string;
}

export interface UserAuthInfo {
  errors: Array<string>;
  user: User;
  isAuthenticated: boolean;
}

@Module
export default class CmsModule extends VuexModule {
  data = {} as any;
  // errors = [];
  // user = {} as User;
  // isAuthenticated = !!JwtService.getToken();
  get cmsTableData() {
    return this.data.data;
  }

  get cmsPage() {
    return this.data.current_page;
  }

  get cmsTotal() {
    return this.data.total;
  }

  get cmsPerPage() {
    return this.data.per_page;
  }

  get cmsColumns() {
    return (sort = [] as Array<string>) => {
      if (!this.cmsTableData) return [];
      const item = this.cmsTableData[0];
      return Object.keys(item).map(key => ({
        property: key,
        label: key,
        sortable: sort.includes(key)
      }));
    };

    if (this.cmsTableData) {
      const item = this.cmsTableData[0];
      return Object.keys(item).map(key => ({
        property: key,
        label: key
      }));
    }
  }

  @Action
  [Actions.CMS_FETCH_MODEL]({ model, params }) {
    return new Promise<void>((resolve, reject) => {
      ApiService.query(model, { params }).then(({ data }) => {
        this.context.commit(Mutations.CMS_SET_DATA, data);
        resolve();
      });
    });
  }

  @Mutation
  [Mutations.CMS_SET_DATA](data) {
    this.data = data;
  }
}
