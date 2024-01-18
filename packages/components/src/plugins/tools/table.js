import { Plugin } from "@super-doc/api";
export default class TableTool extends Plugin.ToolPluginBase {
  type = "TableDoc";
  text = "表格";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      table: [
        {
          enName: "Taxableinformation",
          name: "应缴信息",
          description: "-",
          id: "05cOkDnN",
        },
        {
          enName: "Role",
          name: "角色",
          description: "-",
          id: "2lPmQ0HO",
        },
        {
          enName: "Authority",
          name: "权限",
          description: "-",
          id: "7hm6pr99",
        },
        {
          enName: "SettlementAccountInfo",
          name: "结算账户信息",
          description: "-",
          id: "AN0oELJG",
        },
        {
          enName: "Merchantcontract",
          name: "商户合约",
          description: "-",
          id: "dBmxm7aN",
        },
        {
          enName: "CustomerContract",
          name: "客户合约",
          description: "-",
          id: "e7PYF8ZN",
        },
        {
          enName: "Collect",
          name: "代收",
          description: "-",
          id: "epMNsvPj",
        },
        {
          enName: "TempAccountInformation",
          name: "暂存账户信息",
          description: "-",
          id: "heTQfdyD",
        },
        {
          enName: "MerchantContractApplicationForm",
          name: "商户合约申请单",
          description: "-",
          id: "Hh7DPJ3y",
        },
        {
          enName: "MerchantInformation",
          name: "商户信息",
          description: "-",
          id: "Ii0fOZ1S",
        },
        {
          enName: "CustomerContractApplicationForm",
          name: "客户合约申请单",
          description: "-",
          id: "LKYun9WI",
        },
        {
          enName: "Collectablerecordstatus",
          name: "代收记录状态",
          description: "-",
          id: "mmodB9uk",
        },
        {
          enName: "MerchantContract",
          name: "商户合约",
          description: "-",
          id: "NRDQosvs",
        },
        {
          enName: "Billpaymenthistory",
          name: "缴费记录",
          description: "-",
          id: "RyQTzPUu",
        },
        {
          enName: "Merchantsettlementaccountinfo",
          name: "商户结算账户信息",
          description: "-",
          id: "SGP2StmW",
        },
        {
          enName: "CustomerInformation",
          name: "客户信息",
          description: "-",
          id: "YH8guijP",
        },
        {
          enName: "User",
          name: "用户",
          description: "-",
          id: "zDtefAYX",
        },
      ],
      title: [
        {
          value: "${datas[].name}",
          title: "中文",
        },
        {
          value: "${datas[].enName}",
          title: "英文"
        },
        {
          value: "${datas[].description}",
          title: "业务含义"
        }
      ],
    },
    class: this.type,
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement("div");
    div.textContent = "表格";
    return div;
  }
}
