(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{44:function(e,t,n){e.exports=n(92)},53:function(e,t,n){},54:function(e,t,n){},60:function(e,t,n){},61:function(e,t,n){},62:function(e,t,n){},63:function(e,t,n){},64:function(e,t,n){},65:function(e,t,n){},66:function(e,t,n){},67:function(e,t,n){},68:function(e,t,n){},69:function(e,t,n){},70:function(e,t,n){},91:function(e,t,n){},92:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(20),c=n.n(o),l=n(7);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var i=n(18),u=n(39),s=n(23),d=n(40),m="UPDATE_ACCOUNT",p="UPDATE_VALIDATORS",f="UPDATE_DELEGATIONS",v={account:{},validators:[],delegations:[]};function E(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=arguments.length>1?arguments[1]:void 0;return Object(d.a)(e,function(e){switch(t.type){case m:var n=t.payload.account;return void(n&&"object"===typeof n&&(e.account=Object(s.a)({},e.account,t.payload.account)));case p:return void(e.validators=t.payload.validators);case f:return void(e.delegations=t.payload.delegations);default:return e}})}var g=function(e){return function(t){return function(n){console.group(n.type),console.info("dispatching",n);var a=t(n);return console.log("next state",e.getState()),console.groupEnd(),a}}};var h=n(1),b=n(2),O=n(4),j=n(3),y=n(5),k=n(8),N=n(15),A=function(e){return e.account},w=function(e){return e.validators},C=function(e){return e.delegations},D=(n(53),n(54),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props.index;return r.a.createElement("div",{className:"navbar"},r.a.createElement("div",null,r.a.createElement(k.b,{className:0===e?"selected":"",to:"/"},"\u6211\u7684\u59d4\u6258"),r.a.createElement(k.b,{className:1===e?"selected":"",to:"/validators"},"\u9a8c\u8bc1\u8005")))}}]),t}(a.Component)),x=(n(60),n(16)),I=n.n(x),M=n(42),T=n.n(M),_={denom:"muon"},P={transfer:{amount:[{amount:"3000",denom:_.denom}],gas:"120000"},retainFee:.01};function S(e,t,n){return{from:e,chainType:"COSMOS",fee:P.transfer,msg:t,memo:n}}function B(e,t,n,a){return{type:"cosmos-sdk/MsgDelegate",value:{delegator_address:e,validator_address:t,amount:{amount:n,denom:a}}}}function V(e,t,n,a){return{type:"cosmos-sdk/MsgUndelegate",value:{delegator_address:e,validator_address:t,amount:{amount:n,denom:a}}}}I.a.DP=20,I.a.RM=0;var L=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20;return e&&e.length>t?"".concat(e.substring(0,t/2),"...").concat(e.substring(e.length-t/2,e.length)):e},F=function(e){return new I.a(e)},X=function(e){return new I.a(e,10).times(1e6).toString()},J=function(e){return new I.a(e).div(1e6).toString()},R=function(e){return T()(e).format("0,0.[0000]")},U=function(e){return"undefined"!==typeof e},z=function(e){var t=e;return t&&t.coins&&Array.isArray(t.coins)&&t.coins.find(function(e){return"uatom"===e.denom||"muon"===e.denom}).amount||0},Y=function(e){var t=0;return e.forEach(function(e){t+=1*e.shares}),t.toFixed(0)},q=function(e){var t=0;return e.forEach(function(e){t+=1*e.amount}),t.toFixed(0)},G=function(e){var t=0;return e.forEach(function(e){Array.isArray(e.entries)&&e.entries.forEach(function(e){t+=1*e.balance})}),t.toFixed(0)},Z=function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props.account,t=e.address,n=e.balance,a=e.rewardBalance,o=e.refundingBalance,c=e.delegateBalance;return r.a.createElement("div",{className:"account-card"},r.a.createElement("div",{className:"account-top"},r.a.createElement("div",{className:"account-top-address"},r.a.createElement("strong",null,"Cosmos Wallet"),r.a.createElement("span",null,L(t||"\u83b7\u53d6\u8d26\u53f7\u4e2d...",24))),r.a.createElement("div",{className:"account-top-amount"},r.a.createElement("strong",null,U(n)?R(J(n)):"~"),r.a.createElement("span",null,"\xa5 ",U(n)?R(F(J(n)).times(30).toString()):"~"))),r.a.createElement("div",{className:"account-bottom"},r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("span",null,"\u53ef\u7528\u4f59\u989d"),r.a.createElement("i",null,U(n)?R(J(n)):"~")),r.a.createElement("div",null,r.a.createElement("span",null,"\u6536\u76ca"),r.a.createElement("i",null,U(a)?R(J(a)):"~"))),r.a.createElement("div",{className:"split-line"}),r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("span",null,"\u59d4\u6258"),r.a.createElement("i",null,U(c)?R(J(c)):"~")),r.a.createElement("div",null,r.a.createElement("span",null,"\u8d4e\u56de\u4e2d"),r.a.createElement("i",null,U(o)?R(J(o)):"~")))))}}]),t}(a.Component),H=Object(l.b)(function(e){return{account:A(e)}},{})(Z),K=(n(61),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"renderItem",value:function(e,t,n){return t?r.a.createElement(k.b,{className:"dl-card",key:n,to:"/validators/".concat(t.operator_address)},r.a.createElement("strong",null,t.description.moniker),r.a.createElement("div",null,r.a.createElement("span",null,"\u5df2\u59d4\u6258"),r.a.createElement("i",null,R(J(e.shares))))):null}},{key:"render",value:function(){var e=this,t=this.props,n=t.delegations,a=t.validators;return r.a.createElement("div",{className:"delegations"},!!n&&n.map(function(t,n){var r=a.find(function(e){return e.operator_address===t.validator_address});return e.renderItem(t,r,n)}))}}]),t}(a.Component)),Q=Object(l.b)(function(e){return{validators:w(e),delegations:C(e)}},{})(K),W=function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"renderDelegateBanner",value:function(){return r.a.createElement("div",{className:"banner"},r.a.createElement("div",{onClick:function(){}},r.a.createElement("img",{src:"/images/banner.png",alt:"staking"})))}},{key:"render",value:function(){return r.a.createElement("div",{className:"home",id:"home"},r.a.createElement(D,{index:0}),r.a.createElement(H,null),r.a.createElement(Q,null),this.renderDelegateBanner())}}]),t}(a.Component),$=Object(N.e)(Object(l.b)(function(e){return{}},{})(W)),ee=(n(62),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props.validator,t=J(e.tokens),n=(t/237538998).toFixed(3);return r.a.createElement(k.b,{className:"validator",to:"/validators/".concat(e.operator_address)},r.a.createElement("div",{className:"logo"},r.a.createElement("img",{alt:"logo",src:e.description.logo||"../../../images/default-validator.png"})),r.a.createElement("div",{className:"v-left"},r.a.createElement("strong",null,e.description.moniker),r.a.createElement("span",null,R(t)," (",n,"%)")),r.a.createElement("div",{className:"v-right"},r.a.createElement("strong",null,"7%"),r.a.createElement("span",null,"\u5e74\u5316\u6536\u76ca")))}}]),t}(a.Component)),te=Object(l.b)(function(e){return{}},{})(ee),ne=(n(63),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props.validators;return r.a.createElement("div",{className:"validator-list"},e.map(function(e){return r.a.createElement(te,{validator:e,key:e.operator_address})}))}}]),t}(a.Component)),ae=Object(N.e)(Object(l.b)(function(e){return{validators:w(e)}})(ne)),re=(n(64),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return r.a.createElement("div",{className:"validators"},r.a.createElement(D,{index:1}),r.a.createElement(ae,null))}}]),t}(a.Component)),oe=Object(N.e)(Object(l.b)(function(e){return{}})(re)),ce=(n(65),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.validators,n=e.match,a=n.params.id,o=t.find(function(e){return e.operator_address===a});return console.log(o,n),o?r.a.createElement("div",{className:"validator-detail"},r.a.createElement("section",null,r.a.createElement("div",{className:"top"},r.a.createElement("div",{className:"logo"},r.a.createElement("img",{alt:"logo",src:o.description.logo||"../../../images/default-validator.png"})),r.a.createElement("div",{className:"left"},r.a.createElement("strong",null,o.description.moniker),r.a.createElement("span",null,L(o.operator_address,24)))),r.a.createElement("div",{className:"desc"},o.description.details||"no description")),r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement("span",null,"\u603b\u59d4\u6258"),r.a.createElement("i",null,R(J(o.tokens))," ATOM")),r.a.createElement("li",null,r.a.createElement("span",null,"\u9a8c\u8bc1\u8005\u59d4\u6258"),r.a.createElement("i",null,R(J(o.delegator_shares))," ATOM")),r.a.createElement("li",null,r.a.createElement("span",null,"\u59d4\u6258\u8005"),r.a.createElement("i",null,"~")),r.a.createElement("li",null,r.a.createElement("span",null,"\u4f63\u91d1"),r.a.createElement("i",null,(+o.commission.rate).toFixed(3)," %")),r.a.createElement("li",null,r.a.createElement("span",null,"\u5e74\u5316\u6536\u76ca"),r.a.createElement("i",null,o.annualized_returns," %"))),r.a.createElement("div",{className:"toolbar"},r.a.createElement(k.b,{to:"/undelegate/".concat(o.operator_address)},"\u8d4e\u56de"),r.a.createElement(k.b,{to:"/delegate/".concat(o.operator_address)},"\u59d4\u6258"))):r.a.createElement("h1",{className:"loading-text"},"Loading...")}}]),t}(a.Component)),le=Object(N.e)(Object(l.b)(function(e){return{validators:w(e)}})(ce)),ie=n(22);n(66);window.imToken=window.imToken||{callPromisifyAPI:function(e,t){switch(console.log(e,t),e){case"cosmos.getAccounts":return Promise.resolve(["cosmos16gdxm24ht2mxtpz9cma6tr6a6d47x63hlq4pxt"]);case"cosmos.getProvider":return Promise.resolve("https://stargate.cosmos.network");case"private.getHeaders":return Promise.resolve('{"Authorization":"Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VUb2tlbiI6IkVBQjZBRTJELThFNEYtNEFDMS1CODM4LTA5MkQwMzE2NjlGQSIsImp0aSI6ImltMTR4NUxZck11Q1lxaXdTRzVBeFhaOXlGRDlIdml2VmJKdDVMRiJ9.rkJ2jziqRKwHvUKX2xkrkA2CDppGegElgVuZ2syHf5Y","X-IDENTIFIER":"im14x5LYrMuCYqiwSG5AxXZ9yFD9HvivVbJt5LF","X-CLIENT-VERSION":"ios:2.3.1.515:14","X-DEVICE-TOKEN":"EAB6AE2D-8E4F-4AC1-B838-092D031669FA","X-LOCALE":"en-US","X-CURRENCY":"USD","X-DEVICE-LOCALE":"en","X-APP-ID":"im.token.app","X-API-KEY":"3bdc0a49ba634a8e8f3333f8e66e0b84","Content-Type":"application/json"}');default:return Promise.resolve()}}};var ue=window.imToken;function se(e){return ue.callPromisifyAPI("cosmos.sendTransaction",e)}var de=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,a=Number(e);if(isNaN(a))return[!1,"\u91d1\u989d\u4e0d\u5408\u6cd5"];if(a<=0)return[!1,"\u8bf7\u8f93\u5165\u5927\u4e8e 0 \u7684\u91d1\u989d"];var r=F(a);return r.plus(n).gt(t)?r.lt(t)?[!1,"\u77ff\u5de5\u8d39\u4e0d\u591f"]:[!1,"\u8d85\u51fa\u53ef\u7528\u6570\u91cf"]:[!0,null]},me={operator_address:"cosmosvaloper1zkupr83hrzkn3up5elktzcq3tuft8nxsmwdqgp"},pe=function(e){function t(){var e,n;Object(h.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(O.a)(this,(e=Object(j.a)(t)).call.apply(e,[this].concat(r)))).state={amount:""},n.onSubmit=function(){var e=n.props.account,t=e.balance,a=e.address,r=n.state.amount,o=de(r,J(t),P.retainFee),c=Object(ie.a)(o,2),l=c[0],i=c[1];if(!l)return alert(i);se(S(a,[B(a,me.operator_address,X(r),_.denom)],"delegate from imToken")).then(function(e){alert("\u53d1\u9001\u6210\u529f: "+e),console.log(e)}).catch(function(e){alert("\u53d1\u9001\u5931\u8d25: "+e.message)})},n.onChange=function(e){n.setState({amount:e.target.value})},n}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"afterOpenModal",value:function(){}},{key:"render",value:function(){var e=this.props.account.balance,t=this.state.amount,n=U(e)?R(J(e)):0,a=!t;return r.a.createElement("div",{className:"form-inner"},r.a.createElement("div",{className:"form-header"},r.a.createElement("span",null,"\u53ef\u7528\u4f59\u989d"),r.a.createElement("i",null,n," ATOM")),r.a.createElement("input",{type:"number",placeholder:"\u8f93\u5165\u91d1\u989d",value:t,onChange:this.onChange,max:n,min:1e-6}),r.a.createElement("button",{disabled:a,className:"form-button",onClick:this.onSubmit},"\u59d4\u6258"))}}]),t}(a.Component),fe=(n(67),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.validators,n=e.account,a=e.match,o=a.params.id,c=t.find(function(e){return e.operator_address===o});return console.log(c,a),c?r.a.createElement("div",{className:"delegate-page"},r.a.createElement("div",{className:"validator-detail"},r.a.createElement("section",null,r.a.createElement("div",{className:"top"},r.a.createElement("div",{className:"logo"},r.a.createElement("img",{alt:"logo",src:c.description.logo||"../../../images/default-validator.png"})),r.a.createElement("div",{className:"left"},r.a.createElement("strong",null,c.description.moniker),r.a.createElement("span",null,L(c.operator_address,24)))))),r.a.createElement(pe,{account:n})):r.a.createElement("h1",{className:"loading-text"},"Loading...")}}]),t}(a.Component)),ve=Object(N.e)(Object(l.b)(function(e){return{validators:w(e),account:A(e)}})(fe)),Ee=(n(68),function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(O.a)(this,Object(j.a)(t).call(this,e))).onSubmit=function(){var e=n.props.account,t=n.state.selectedDelegation,a=t.shares,r=e.address,o=n.state.amount,c=de(o,J(a)),l=Object(ie.a)(c,2),i=l[0],u=l[1];if(!i)return alert(u);se(S(r,[V(r,t.validator_address,X(o),_.denom)],"undelegate from imToken")).then(function(e){alert("\u53d1\u9001\u6210\u529f: "+e),console.log(e)}).catch(function(e){alert("\u53d1\u9001\u5931\u8d25: "+e.message)})},n.onChange=function(e){n.setState({amount:e.target.value})},n.state={amount:"",selectedDelegation:e.delegations[0]},n}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"afterOpenModal",value:function(){}},{key:"render",value:function(){var e=this.state.selectedDelegation;if(!e)return null;var t=e.shares,n=this.state.amount,a=U(t)?R(J(t)):0,o=!n;return r.a.createElement("div",{className:"form-inner"},r.a.createElement("div",{className:"form-header"},r.a.createElement("span",null,"\u5df2\u62b5\u62bc"),r.a.createElement("i",null,a," ATOM")),r.a.createElement("input",{type:"number",placeholder:"\u8f93\u5165\u91d1\u989d",value:n,onChange:this.onChange,max:a,min:1e-6}),r.a.createElement("button",{disabled:o,className:"form-button",onClick:this.onSubmit},"\u53d6\u6d88\u59d4\u6258"))}}]),t}(a.Component)),ge=(n(69),function(e){function t(){return Object(h.a)(this,t),Object(O.a)(this,Object(j.a)(t).apply(this,arguments))}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.validators,n=e.account,a=e.delegations,o=e.match,c=o.params.id,l=t.find(function(e){return e.operator_address===c});return console.log(l,o),l?r.a.createElement("div",{className:"delegate-page"},r.a.createElement("div",{className:"validator-detail"},r.a.createElement("section",null,r.a.createElement("div",{className:"top"},r.a.createElement("div",{className:"logo"},r.a.createElement("img",{alt:"logo",src:l.description.logo||"../../../images/default-validator.png"})),r.a.createElement("div",{className:"left"},r.a.createElement("strong",null,l.description.moniker),r.a.createElement("span",null,L(l.operator_address,24)))))),r.a.createElement(Ee,{account:n,delegations:a})):r.a.createElement("h1",{className:"loading-text"},"Loading...")}}]),t}(a.Component)),he=Object(N.e)(Object(l.b)(function(e){return{validators:w(e),delegations:C(e),account:A(e)}})(ge)),be=(n(70),n(28)),Oe=n.n(be),je=n(43),ye=n(29),ke=n.n(ye),Ne=null,Ae=null;function we(){return Ce.apply(this,arguments)}function Ce(){return(Ce=Object(je.a)(Oe.a.mark(function e(){return Oe.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.t0=Ne,e.t0){e.next=5;break}return e.next=4,ue.callPromisifyAPI("private.getHeaders").then(function(e){return JSON.parse(e)}).then(function(e){return delete e["X-LOCALE"],{}});case 4:e.t0=e.sent;case 5:if(e.t1=e.t0,e.t2=Ae,e.t2){e.next=11;break}return e.next=10,ue.callPromisifyAPI("cosmos.getProvider");case 10:e.t2=e.sent;case 11:return e.t3=e.t2,e.abrupt("return",{headers:e.t1,provider:e.t3});case 13:case"end":return e.stop()}},e)}))).apply(this,arguments)}function De(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return we().then(function(n){var a=n.headers,r=n.provider,o="".concat(r,"/").concat(e);return ke()({method:"get",url:o,params:t,headers:a}).then(function(n){if(n.data)return n.data;throw new Error("null response ".concat(e," ").concat(JSON.stringify(t)))}).catch(function(e){console.warn(e)})})}var xe=function(e){return De("staking/delegators/".concat(e,"/delegations"),{}).then(function(e){return e||[]})},Ie=function(e){return De("distribution/delegators/".concat(e,"/rewards"),{}).then(function(e){return e||[]})},Me=function(e){return De("staking/delegators/".concat(e,"/unbonding_delegations"),{}).then(function(e){return e||[]})};var Te=function(e){function t(){var e,n;Object(h.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(O.a)(this,(e=Object(j.a)(t)).call.apply(e,[this].concat(r)))).updateAsyncData=function(){var e=n.props,t=e.updateAccount,a=e.updateDelegations,r=e.updateValidators;ue.callPromisifyAPI("cosmos.getAccounts").then(function(e){var n=e[0];t({address:n}),Ie(n).then(q).then(function(e){t({rewardBalance:e})}),Me(n).then(G).then(function(e){t({refundingBalance:e})}),function(e){var t={coins:[],sequence:"0",account_number:"0"};return De("auth/accounts/".concat(e),{}).then(function(e){if(!e)throw new Error("no response");var n=e.value||t;if("auth/DelayedVestingAccount"===e.type){if(!n.BaseVestingAccount)return t;delete(n=Object.assign({},n.BaseVestingAccount.BaseAccount,n.BaseVestingAccount)).BaseAccount,delete n.BaseVestingAccount}return n}).catch(function(e){if(e.message.includes("account bytes are empty")||e.message.includes("failed to prove merkle proof"))return t;console.warn(e)})}(n).then(function(e){var n=z(e);t(Object(s.a)({},e,{balance:n}))}),xe(n).then(function(e){var n=Y(e);a(e),t({delegateBalance:n})})}),De("staking/validators").then(function(e){return e||[]}).then(r)},n}return Object(y.a)(t,e),Object(b.a)(t,[{key:"componentWillMount",value:function(){this.updateAsyncData()}},{key:"render",value:function(){return r.a.createElement(k.a,null,r.a.createElement(N.c,null,r.a.createElement(N.a,{exact:!0,path:"/",component:$}),r.a.createElement(N.a,{exact:!0,path:"/validators",component:oe}),r.a.createElement(N.a,{path:"/validators/:id",component:le}),r.a.createElement(N.a,{path:"/delegate/:id",component:ve}),r.a.createElement(N.a,{path:"/undelegate/:id",component:he})))}}]),t}(a.Component),_e={updateAccount:function(e){return{type:m,payload:{account:e}}},updateDelegations:function(e){return{type:f,payload:{delegations:e}}},updateValidators:function(e){return{type:p,payload:{validators:e}}}},Pe=Object(l.b)(function(e){return{validators:w(e)}},_e)(Te),Se=(n(91),function(e){var t=[g,u.a],n=i.a.apply(void 0,t);return Object(i.c)(E,e,n)}(void 0));c.a.render(r.a.createElement(l.a,{store:Se},r.a.createElement(Pe,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[44,1,2]]]);
//# sourceMappingURL=main.298b0426.chunk.js.map