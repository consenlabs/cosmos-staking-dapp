(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{38:function(e,t,n){e.exports=n(81)},47:function(e,t,n){},48:function(e,t,n){},57:function(e,t,n){},58:function(e,t,n){},59:function(e,t,n){},80:function(e,t,n){},81:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(10),c=n.n(r),l=n(2);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var i=n(11),s=n(34),u=n(15),d=n(35),m="UPDATE_ACCOUNT",f="UPDATE_VALIDATORS",p="UPDATE_DELEGATIONS",v={account:{},validators:[],delegations:[]};function g(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=arguments.length>1?arguments[1]:void 0;return Object(d.a)(e,function(e){switch(t.type){case m:var n=t.payload.account;return void(n&&"object"===typeof n&&(e.account=Object(u.a)({},e.account,t.payload.account)));case f:return void(e.validators=t.payload.validators);case p:return void(e.delegations=t.payload.delegations);default:return e}})}var h=function(e){return function(t){return function(n){console.group(n.type),console.info("dispatching",n);var a=t(n);return console.log("next state",e.getState()),console.groupEnd(),a}}};var b=n(3),E=n(4),y=n(6),O=n(5),k=n(7),A=function(e){return e.account},D=function(e){return e.validators},C=function(e){return e.delegations},j=(n(47),n(14)),w=(n(48),n(13)),M=n.n(w),I=n(9),N=n.n(I),S=n(36),P=n.n(S),T={denom:"muon"},V={transfer:{amount:[{amount:"3000",denom:T.denom}],gas:"120000"},retainFee:.01};function x(e,t,n){return{from:e,chainType:"COSMOS",fee:V.transfer,msg:t,memo:n}}function R(e,t,n,a){return{type:"cosmos-sdk/MsgDelegate",value:{delegator_address:e,validator_address:t,amount:{amount:n,denom:a}}}}function B(e,t,n,a){return{type:"cosmos-sdk/MsgUndelegate",value:{delegator_address:e,validator_address:t,amount:{amount:n,denom:a}}}}N.a.DP=20,N.a.RM=0;var L=function(e){return new N.a(e)},X=function(e){return new N.a(e,10).times(1e6).toString()},q=function(e){return new N.a(e).div(1e6).toString()},U=function(e){return P()(e).format("0,0.[0000]")},_=function(e){return"undefined"!==typeof e},F=function(e){var t=e;return t&&t.coins&&Array.isArray(t.coins)&&t.coins.find(function(e){return"uatom"===e.denom||"muon"===e.denom}).amount||0},J=function(e){var t=0;return e.forEach(function(e){t+=1*e.shares}),t.toFixed(0)},z=function(e){var t=0;return e.forEach(function(e){t+=1*e.amount}),t.toFixed(0)},Y=function(e){var t=0;return e.forEach(function(e){Array.isArray(e.entries)&&e.entries.forEach(function(e){t+=1*e.balance})}),t.toFixed(0)};window.imToken=window.imToken||{callPromisifyAPI:function(e,t){switch(console.log(e,t),e){case"cosmos.getAccounts":return Promise.resolve(["cosmos16gdxm24ht2mxtpz9cma6tr6a6d47x63hlq4pxt"]);case"cosmos.getProvider":return Promise.resolve("https://stargate.cosmos.network");case"private.getHeaders":return Promise.resolve('{"Authorization":"Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VUb2tlbiI6IkVBQjZBRTJELThFNEYtNEFDMS1CODM4LTA5MkQwMzE2NjlGQSIsImp0aSI6ImltMTR4NUxZck11Q1lxaXdTRzVBeFhaOXlGRDlIdml2VmJKdDVMRiJ9.rkJ2jziqRKwHvUKX2xkrkA2CDppGegElgVuZ2syHf5Y","X-IDENTIFIER":"im14x5LYrMuCYqiwSG5AxXZ9yFD9HvivVbJt5LF","X-CLIENT-VERSION":"ios:2.3.1.515:14","X-DEVICE-TOKEN":"EAB6AE2D-8E4F-4AC1-B838-092D031669FA","X-LOCALE":"en-US","X-CURRENCY":"USD","X-DEVICE-LOCALE":"en","X-APP-ID":"im.token.app","X-API-KEY":"3bdc0a49ba634a8e8f3333f8e66e0b84","Content-Type":"application/json"}');default:return Promise.resolve()}}};var G=window.imToken;function Z(e){return G.callPromisifyAPI("cosmos.sendTransaction",e)}var H=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a=Number(e);if(isNaN(a))return[!1,"\u91d1\u989d\u4e0d\u5408\u6cd5"];if(a<=0)return[!1,"\u8bf7\u8f93\u5165\u5927\u4e8e 0 \u7684\u91d1\u989d"];var o=L(a);return o.plus(n).gt(t)?o.lt(t)?[!1,"\u77ff\u5de5\u8d39\u4e0d\u591f"]:[!1,"\u8d85\u51fa\u53ef\u7528\u6570\u91cf"]:[!0,null]},K={operator_address:"cosmosvaloper1zkupr83hrzkn3up5elktzcq3tuft8nxsmwdqgp"},Q={content:{top:"50%",left:"0",right:"0",bottom:"-8px",borderRadius:"8px"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.5)"}},W=function(e){function t(){var e,n;Object(b.a)(this,t);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(y.a)(this,(e=Object(O.a)(t)).call.apply(e,[this].concat(o)))).state={amount:""},n.onSubmit=function(){var e=n.props.account,t=e.balance,a=e.address,o=n.state.amount,r=H(o,q(t),V.retainFee),c=Object(j.a)(r,2),l=c[0],i=c[1];if(!l)return alert(i);Z(x(a,[R(a,K.operator_address,X(o),T.denom)],"delegate from imToken")).then(function(e){alert("\u53d1\u9001\u6210\u529f: "+e),n.props.onRequestClose(),n.props.onDelegateSuccess(),console.log(e)}).catch(function(e){alert("\u53d1\u9001\u5931\u8d25: "+e.message)})},n.onChange=function(e){n.setState({amount:e.target.value})},n}return Object(k.a)(t,e),Object(E.a)(t,[{key:"componentDidMount",value:function(){}},{key:"afterOpenModal",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.visible,n=e.onRequestClose,a=e.account.balance,r=this.state.amount,c=_(a)?U(q(a)):0,l=!r;return o.a.createElement(M.a,{isOpen:t,closeTimeoutMS:300,onAfterOpen:this.afterOpenModal,onRequestClose:n,style:Q,contentLabel:"Delegate Modal"},o.a.createElement("div",{className:"modal-inner"},o.a.createElement("div",{className:"form-header"},o.a.createElement("span",null,"\u53ef\u7528\u4f59\u989d"),o.a.createElement("i",null,c," ATOM")),o.a.createElement("input",{type:"number",placeholder:"\u8f93\u5165\u91d1\u989d",value:r,onChange:this.onChange,max:c,min:1e-6}),o.a.createElement("button",{disabled:l,className:"form-button",onClick:this.onSubmit},"\u59d4\u6258")))}}]),t}(a.Component),$=Object(l.b)(function(e){return{account:A(e)}},{})(W),ee=(n(57),{content:{top:"50%",left:"0",right:"0",bottom:"-8px",borderRadius:"8px"},overlay:{backgroundColor:"rgba(0, 0, 0, 0.5)"}}),te=function(e){function t(){var e,n;Object(b.a)(this,t);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(y.a)(this,(e=Object(O.a)(t)).call.apply(e,[this].concat(o)))).state={amount:""},n.onSubmit=function(){var e=n.props,t=e.account,a=e.selectedDelegation,o=a.shares,r=t.address,c=n.state.amount,l=H(c,q(o)),i=Object(j.a)(l,2),s=i[0],u=i[1];if(!s)return alert(u);Z(x(r,[B(r,a.validator_address,X(c),T.denom)],"undelegate from imToken")).then(function(e){alert("\u53d1\u9001\u6210\u529f: "+e),n.props.onRequestClose(),n.props.onDelegateSuccess(),console.log(e)}).catch(function(e){alert("\u53d1\u9001\u5931\u8d25: "+e.message)})},n.onChange=function(e){n.setState({amount:e.target.value})},n}return Object(k.a)(t,e),Object(E.a)(t,[{key:"componentDidMount",value:function(){}},{key:"afterOpenModal",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.visible,n=e.onRequestClose,a=e.selectedDelegation;if(!a)return null;var r=a.shares,c=this.state.amount,l=_(r)?U(q(r)):0,i=!c;return o.a.createElement(M.a,{isOpen:t,closeTimeoutMS:300,onAfterOpen:this.afterOpenModal,onRequestClose:n,style:ee,contentLabel:"Delegate Modal"},o.a.createElement("div",{className:"modal-inner"},o.a.createElement("div",{className:"form-header"},o.a.createElement("span",null,"\u5df2\u62b5\u62bc"),o.a.createElement("i",null,l," ATOM")),o.a.createElement("input",{type:"number",placeholder:"\u8f93\u5165\u91d1\u989d",value:c,onChange:this.onChange,max:l,min:1e-6}),o.a.createElement("button",{disabled:i,className:"form-button",onClick:this.onSubmit},"\u53d6\u6d88\u59d4\u6258")))}}]),t}(a.Component),ne=Object(l.b)(function(e){return{account:A(e)}},{})(te),ae=(n(58),function(e){function t(){return Object(b.a)(this,t),Object(y.a)(this,Object(O.a)(t).apply(this,arguments))}return Object(k.a)(t,e),Object(E.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props.account,t=e.address,n=e.balance,a=e.rewardBalance,r=e.refundingBalance,c=e.delegateBalance;return o.a.createElement("div",{className:"account-card"},o.a.createElement("div",{className:"account-top"},o.a.createElement("div",{className:"account-top-address"},o.a.createElement("strong",null,"Cosmos Wallet"),o.a.createElement("span",null,function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20;return e&&e.length>t?"".concat(e.substring(0,t/2),"...").concat(e.substring(e.length-t/2,e.length)):e}(t||"\u83b7\u53d6\u8d26\u53f7\u4e2d...",24))),o.a.createElement("div",{className:"account-top-amount"},o.a.createElement("strong",null,_(n)?U(q(n)):"~"),o.a.createElement("span",null,"\xa5 ",_(n)?U(L(q(n)).times(30).toString()):"~"))),o.a.createElement("div",{className:"account-bottom"},o.a.createElement("div",null,o.a.createElement("div",null,o.a.createElement("span",null,"\u53ef\u7528\u4f59\u989d"),o.a.createElement("i",null,_(n)?U(q(n)):"~")),o.a.createElement("div",null,o.a.createElement("span",null,"\u6536\u76ca"),o.a.createElement("i",null,_(a)?U(q(a)):"~"))),o.a.createElement("div",{className:"split-line"}),o.a.createElement("div",null,o.a.createElement("div",null,o.a.createElement("span",null,"\u59d4\u6258"),o.a.createElement("i",null,_(c)?U(q(c)):"~")),o.a.createElement("div",null,o.a.createElement("span",null,"\u8d4e\u56de\u4e2d"),o.a.createElement("i",null,_(r)?U(q(r)):"~")))))}}]),t}(a.Component)),oe=Object(l.b)(function(e){return{account:A(e)}},{})(ae),re=(n(59),function(e){function t(){var e,n;Object(b.a)(this,t);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(n=Object(y.a)(this,(e=Object(O.a)(t)).call.apply(e,[this].concat(o)))).onPress=function(e){n.props.onItemPress(e)},n}return Object(k.a)(t,e),Object(E.a)(t,[{key:"componentDidMount",value:function(){}},{key:"renderItem",value:function(e,t,n){var a=this;return t?o.a.createElement("div",{className:"dl-card",key:n,onClick:function(){return a.onPress(e)}},o.a.createElement("strong",null,t.description.moniker),o.a.createElement("div",null,o.a.createElement("span",null,"\u5df2\u59d4\u6258"),o.a.createElement("i",null,U(q(e.shares))))):null}},{key:"render",value:function(){var e=this,t=this.props,n=t.delegations,a=t.validators;return o.a.createElement("div",{className:"delegations"},!!n&&n.map(function(t,n){var o=a.find(function(e){return e.operator_address===t.validator_address});return e.renderItem(t,o,n)}))}}]),t}(a.Component)),ce=Object(l.b)(function(e){return{validators:D(e),delegations:C(e)}},{})(re),le=n(21),ie=n.n(le),se=n(37),ue=n(22),de=n.n(ue),me=null,fe=null;function pe(){return ve.apply(this,arguments)}function ve(){return(ve=Object(se.a)(ie.a.mark(function e(){return ie.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.t0=me,e.t0){e.next=5;break}return e.next=4,G.callPromisifyAPI("private.getHeaders").then(function(e){return JSON.parse(e)}).then(function(e){return delete e["X-LOCALE"],{}});case 4:e.t0=e.sent;case 5:if(e.t1=e.t0,e.t2=fe,e.t2){e.next=11;break}return e.next=10,G.callPromisifyAPI("cosmos.getProvider");case 10:e.t2=e.sent;case 11:return e.t3=e.t2,e.abrupt("return",{headers:e.t1,provider:e.t3});case 13:case"end":return e.stop()}},e)}))).apply(this,arguments)}function ge(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return pe().then(function(n){var a=n.headers,o=n.provider,r="".concat(o,"/").concat(e);return de()({method:"get",url:r,params:t,headers:a}).then(function(n){if(n.data)return n.data;throw new Error("null response ".concat(e," ").concat(JSON.stringify(t)))}).catch(function(e){console.warn(e)})})}var he=function(e){return ge("staking/delegators/".concat(e,"/delegations"),{}).then(function(e){return e||[]})},be=function(e){return ge("distribution/delegators/".concat(e,"/rewards"),{}).then(function(e){return e||[]})},Ee=function(e){return ge("staking/delegators/".concat(e,"/unbonding_delegations"),{}).then(function(e){return e||[]})};var ye=function(e){function t(e){var n;return Object(b.a)(this,t),(n=Object(y.a)(this,Object(O.a)(t).call(this,e))).updateAsyncData=function(){var e=n.props,t=e.updateAccount,a=e.updateDelegations,o=e.updateValidators;G.callPromisifyAPI("cosmos.getAccounts").then(function(e){var n=e[0];t({address:n}),be(n).then(z).then(function(e){t({rewardBalance:e})}),Ee(n).then(Y).then(function(e){t({refundingBalance:e})}),function(e){var t={coins:[],sequence:"0",account_number:"0"};return ge("auth/accounts/".concat(e),{}).then(function(e){if(!e)throw new Error("no response");var n=e.value||t;if("auth/DelayedVestingAccount"===e.type){if(!n.BaseVestingAccount)return t;delete(n=Object.assign({},n.BaseVestingAccount.BaseAccount,n.BaseVestingAccount)).BaseAccount,delete n.BaseVestingAccount}return n}).catch(function(e){if(e.message.includes("account bytes are empty")||e.message.includes("failed to prove merkle proof"))return t;console.warn(e)})}(n).then(function(e){var n=F(e);t(Object(u.a)({},e,{balance:n}))}),he(n).then(function(e){var n=J(e);a(e),t({delegateBalance:n})})}),ge("staking/validators").then(o)},n.handleDelegate=function(){n.setState({delegateModalVisible:!0})},n.handleUnDelegate=function(e){n.setState({undelegateModalVisible:!0,selectedDelegation:e})},n.handleModalClose=function(){n.setState({delegateModalVisible:!1,undelegateModalVisible:!1})},n.state={delegateModalVisible:!1,undelegateModalVisible:!1,selectedDelegation:null},n}return Object(k.a)(t,e),Object(E.a)(t,[{key:"componentWillMount",value:function(){this.updateAsyncData()}},{key:"componentDidMount",value:function(){}},{key:"renderDelegateBanner",value:function(){return o.a.createElement("div",{className:"banner"},o.a.createElement("div",{onClick:this.handleDelegate},o.a.createElement("img",{src:"/images/banner.png",alt:"staking"})))}},{key:"render",value:function(){var e=this.state,t=e.delegateModalVisible,n=e.undelegateModalVisible,a=e.selectedDelegation;return o.a.createElement("div",{className:"home",id:"home"},o.a.createElement(oe,null),o.a.createElement(ce,{onItemPress:this.handleUnDelegate}),this.renderDelegateBanner(),o.a.createElement($,{visible:t,onRequestClose:this.handleModalClose,onDelegateSuccess:this.updateAsyncData}),o.a.createElement(ne,{visible:n,selectedDelegation:a,onRequestClose:this.handleModalClose,onDelegateSuccess:this.updateAsyncData}))}}]),t}(a.Component),Oe={updateAccount:function(e){return{type:m,payload:{account:e}}},updateDelegations:function(e){return{type:p,payload:{delegations:e}}},updateValidators:function(e){return{type:f,payload:{validators:e}}}},ke=Object(l.b)(function(e){return{validators:D(e)}},Oe)(ye),Ae=(n(80),function(e){var t=[h,s.a],n=i.a.apply(void 0,t);return Object(i.c)(g,e,n)}(void 0));c.a.render(o.a.createElement(l.a,{store:Ae},o.a.createElement(ke,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[38,1,2]]]);
//# sourceMappingURL=main.7d401675.chunk.js.map