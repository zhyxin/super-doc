
import umlObj from "../uml/umlObj.js";
import toolBtn from "../uml/umlToolBtn.js";
import method from "../uml/umlObjMethod.js";
import head from "../uml/umlObjHead.js";
import attr from "../uml/umlObjAttr.js";
import umledge from "../uml/edge.js";
import aggregate from "../uml/umlAggregate.js";
import umlModule from "../uml/umlModule.js";
import umlToolBar from "../uml/umlToolBar.js";
import umlRootTag from "../uml/umlRootTag.js";
import umlLineToolBtn from "../uml/umlLineToolBtn.js";
import umlLineToolBar from "../uml/umlLineToolBar.js";

export default ({ activator, Uae, nodeMixin, editMixin }) => {
  //实例化注册机
  const editorActivator = activator();

  Uae.component("domain_object", umlObj);
  Uae.component("edge", umledge);
  Uae.component("uml-obj", umlObj);
  Uae.component("uml-tool-btn", toolBtn);
  Uae.component("uml-line-tool-btn", umlLineToolBtn);
  Uae.component("uml-tool-bar", umlToolBar);
  Uae.component("uml-line-tool-bar", umlLineToolBar);
  Uae.component("uml-obj-method", method);
  Uae.component("uml-obj-head", head);
  Uae.component("uml-obj-attr", attr);
  Uae.component("aggregate", aggregate);
  Uae.component("module", umlModule);
  Uae.component("uml-root-tag", umlRootTag);

  return editorActivator;
};
