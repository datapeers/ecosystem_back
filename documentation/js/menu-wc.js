'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ecosystem_back documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ActaModule.html" data-type="entity-link" >ActaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ActaModule-ebf53a2137113b18589e19108f75a1afcf483c00fc54ee5d1cd4e4b16e7f7c32228998d571b07b9529c5649de2fadcdc338c3251ee0e1a7a67d89a0c16ddcc92"' : 'data-bs-target="#xs-injectables-links-module-ActaModule-ebf53a2137113b18589e19108f75a1afcf483c00fc54ee5d1cd4e4b16e7f7c32228998d571b07b9529c5649de2fadcdc338c3251ee0e1a7a67d89a0c16ddcc92"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ActaModule-ebf53a2137113b18589e19108f75a1afcf483c00fc54ee5d1cd4e4b16e7f7c32228998d571b07b9529c5649de2fadcdc338c3251ee0e1a7a67d89a0c16ddcc92"' :
                                        'id="xs-injectables-links-module-ActaModule-ebf53a2137113b18589e19108f75a1afcf483c00fc54ee5d1cd4e4b16e7f7c32228998d571b07b9529c5649de2fadcdc338c3251ee0e1a7a67d89a0c16ddcc92"' }>
                                        <li class="link">
                                            <a href="injectables/ActaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ActivitiesConfigModule.html" data-type="entity-link" >ActivitiesConfigModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ActivitiesConfigModule-3c153d4a54039379f55b1c835506f3a601de0a5cb3b653f38326b423dcedf4e770de9be45ffb6c150735c2349d72fe87d795dd64387328a88daf3804660bdc41"' : 'data-bs-target="#xs-injectables-links-module-ActivitiesConfigModule-3c153d4a54039379f55b1c835506f3a601de0a5cb3b653f38326b423dcedf4e770de9be45ffb6c150735c2349d72fe87d795dd64387328a88daf3804660bdc41"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ActivitiesConfigModule-3c153d4a54039379f55b1c835506f3a601de0a5cb3b653f38326b423dcedf4e770de9be45ffb6c150735c2349d72fe87d795dd64387328a88daf3804660bdc41"' :
                                        'id="xs-injectables-links-module-ActivitiesConfigModule-3c153d4a54039379f55b1c835506f3a601de0a5cb3b653f38326b423dcedf4e770de9be45ffb6c150735c2349d72fe87d795dd64387328a88daf3804660bdc41"' }>
                                        <li class="link">
                                            <a href="injectables/ActivitiesConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActivitiesConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AnnouncementsModule.html" data-type="entity-link" >AnnouncementsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AnnouncementsModule-a16032bc4493d910a441dc1dc5d08395bc13f6c15d07741234803f614bfba9908f7f9ceb2e6fbe807c8d7740f58ae023403f557391a235a1c1e1fa2356a6be65"' : 'data-bs-target="#xs-injectables-links-module-AnnouncementsModule-a16032bc4493d910a441dc1dc5d08395bc13f6c15d07741234803f614bfba9908f7f9ceb2e6fbe807c8d7740f58ae023403f557391a235a1c1e1fa2356a6be65"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AnnouncementsModule-a16032bc4493d910a441dc1dc5d08395bc13f6c15d07741234803f614bfba9908f7f9ceb2e6fbe807c8d7740f58ae023403f557391a235a1c1e1fa2356a6be65"' :
                                        'id="xs-injectables-links-module-AnnouncementsModule-a16032bc4493d910a441dc1dc5d08395bc13f6c15d07741234803f614bfba9908f7f9ceb2e6fbe807c8d7740f58ae023403f557391a235a1c1e1fa2356a6be65"' }>
                                        <li class="link">
                                            <a href="injectables/AnnouncementsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ApplicantModule.html" data-type="entity-link" >ApplicantModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ApplicantModule-54924cd389fac5981ea73e14ff8da937c1eb40c75dadf29c378c355d8aadcb29069f273e78ba33450faaed2613128d752d48dc300bce0048085cc8239fad0acf"' : 'data-bs-target="#xs-injectables-links-module-ApplicantModule-54924cd389fac5981ea73e14ff8da937c1eb40c75dadf29c378c355d8aadcb29069f273e78ba33450faaed2613128d752d48dc300bce0048085cc8239fad0acf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApplicantModule-54924cd389fac5981ea73e14ff8da937c1eb40c75dadf29c378c355d8aadcb29069f273e78ba33450faaed2613128d752d48dc300bce0048085cc8239fad0acf"' :
                                        'id="xs-injectables-links-module-ApplicantModule-54924cd389fac5981ea73e14ff8da937c1eb40c75dadf29c378c355d8aadcb29069f273e78ba33450faaed2613128d752d48dc300bce0048085cc8239fad0acf"' }>
                                        <li class="link">
                                            <a href="injectables/ApplicantService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApplicantService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthCodeModule.html" data-type="entity-link" >AuthCodeModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthCodeModule-bb58cf18ca1ff4445bb38611263858cf1a1c27d92eb2bd1617766311a638f93c4cfcff572def625294afce03394630de38c3262fdb083c120271fa24b3086a51"' : 'data-bs-target="#xs-injectables-links-module-AuthCodeModule-bb58cf18ca1ff4445bb38611263858cf1a1c27d92eb2bd1617766311a638f93c4cfcff572def625294afce03394630de38c3262fdb083c120271fa24b3086a51"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthCodeModule-bb58cf18ca1ff4445bb38611263858cf1a1c27d92eb2bd1617766311a638f93c4cfcff572def625294afce03394630de38c3262fdb083c120271fa24b3086a51"' :
                                        'id="xs-injectables-links-module-AuthCodeModule-bb58cf18ca1ff4445bb38611263858cf1a1c27d92eb2bd1617766311a638f93c4cfcff572def625294afce03394630de38c3262fdb083c120271fa24b3086a51"' }>
                                        <li class="link">
                                            <a href="injectables/AuthCodeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthCodeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-eae6e5cb9a18d5a13da313b00b2f5a72e55f54781c22423f3bc544cb9af569ca7b8a7cbfb83d3812fdcbaf4f1628365636e4c1e887a80cd83c235d83ad6f5d2e"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-eae6e5cb9a18d5a13da313b00b2f5a72e55f54781c22423f3bc544cb9af569ca7b8a7cbfb83d3812fdcbaf4f1628365636e4c1e887a80cd83c235d83ad6f5d2e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-eae6e5cb9a18d5a13da313b00b2f5a72e55f54781c22423f3bc544cb9af569ca7b8a7cbfb83d3812fdcbaf4f1628365636e4c1e887a80cd83c235d83ad6f5d2e"' :
                                        'id="xs-injectables-links-module-AuthModule-eae6e5cb9a18d5a13da313b00b2f5a72e55f54781c22423f3bc544cb9af569ca7b8a7cbfb83d3812fdcbaf4f1628365636e4c1e887a80cd83c235d83ad6f5d2e"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BusinessModule.html" data-type="entity-link" >BusinessModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BusinessModule-da92e8b3dfbffac5fd63feb0b751d8024e7d14207b7a556f7bc458d3813cc31e46608cb0015949fc28c05e3741b9a098b4f514e26cef9c417b75c7b6cc979035"' : 'data-bs-target="#xs-injectables-links-module-BusinessModule-da92e8b3dfbffac5fd63feb0b751d8024e7d14207b7a556f7bc458d3813cc31e46608cb0015949fc28c05e3741b9a098b4f514e26cef9c417b75c7b6cc979035"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BusinessModule-da92e8b3dfbffac5fd63feb0b751d8024e7d14207b7a556f7bc458d3813cc31e46608cb0015949fc28c05e3741b9a098b4f514e26cef9c417b75c7b6cc979035"' :
                                        'id="xs-injectables-links-module-BusinessModule-da92e8b3dfbffac5fd63feb0b751d8024e7d14207b7a556f7bc458d3813cc31e46608cb0015949fc28c05e3741b9a098b4f514e26cef9c417b75c7b6cc979035"' }>
                                        <li class="link">
                                            <a href="injectables/BusinessService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BusinessService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigEvaluationsModule.html" data-type="entity-link" >ConfigEvaluationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ConfigEvaluationsModule-e689377180f4d49bff67ec6035467ca9147c9ded113277614e3dd9cf40e161c8ccfb6150a302dd2b3c7c07ac39e10f2ab0474e6b7ef62f89528b30040439beb6"' : 'data-bs-target="#xs-injectables-links-module-ConfigEvaluationsModule-e689377180f4d49bff67ec6035467ca9147c9ded113277614e3dd9cf40e161c8ccfb6150a302dd2b3c7c07ac39e10f2ab0474e6b7ef62f89528b30040439beb6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigEvaluationsModule-e689377180f4d49bff67ec6035467ca9147c9ded113277614e3dd9cf40e161c8ccfb6150a302dd2b3c7c07ac39e10f2ab0474e6b7ef62f89528b30040439beb6"' :
                                        'id="xs-injectables-links-module-ConfigEvaluationsModule-e689377180f4d49bff67ec6035467ca9147c9ded113277614e3dd9cf40e161c8ccfb6150a302dd2b3c7c07ac39e10f2ab0474e6b7ef62f89528b30040439beb6"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigEvaluationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigEvaluationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigNotificationsModule.html" data-type="entity-link" >ConfigNotificationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ConfigNotificationsModule-6463f979b692d82dc264c46ee95e142678b71c9e29b05dd077d2e5393f75903051c5c2dbc3fae01a374598232bd0c52d8cf626d020ce6d05e56c9393ad72c942"' : 'data-bs-target="#xs-injectables-links-module-ConfigNotificationsModule-6463f979b692d82dc264c46ee95e142678b71c9e29b05dd077d2e5393f75903051c5c2dbc3fae01a374598232bd0c52d8cf626d020ce6d05e56c9393ad72c942"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigNotificationsModule-6463f979b692d82dc264c46ee95e142678b71c9e29b05dd077d2e5393f75903051c5c2dbc3fae01a374598232bd0c52d8cf626d020ce6d05e56c9393ad72c942"' :
                                        'id="xs-injectables-links-module-ConfigNotificationsModule-6463f979b692d82dc264c46ee95e142678b71c9e29b05dd077d2e5393f75903051c5c2dbc3fae01a374598232bd0c52d8cf626d020ce6d05e56c9393ad72c942"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigNotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigNotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigurationAppModule.html" data-type="entity-link" >ConfigurationAppModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ConfigurationAppModule-bcf8350c1a74720da5f573242dc733ebe92a2281bb598df6308e8e88866b70fad87117e9cd0725ebf14abbe1a4a472e4094be543d6ba2763ce16e59ed839197a"' : 'data-bs-target="#xs-injectables-links-module-ConfigurationAppModule-bcf8350c1a74720da5f573242dc733ebe92a2281bb598df6308e8e88866b70fad87117e9cd0725ebf14abbe1a4a472e4094be543d6ba2763ce16e59ed839197a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigurationAppModule-bcf8350c1a74720da5f573242dc733ebe92a2281bb598df6308e8e88866b70fad87117e9cd0725ebf14abbe1a4a472e4094be543d6ba2763ce16e59ed839197a"' :
                                        'id="xs-injectables-links-module-ConfigurationAppModule-bcf8350c1a74720da5f573242dc733ebe92a2281bb598df6308e8e88866b70fad87117e9cd0725ebf14abbe1a4a472e4094be543d6ba2763ce16e59ed839197a"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigurationAppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationAppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContentModule.html" data-type="entity-link" >ContentModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ContentModule-07856a5ed1ec8560bc14ec6c668ee2d3fc460bba0cdc319e9b84a18a6e78890f0295b26eaba2a7c2037714dee651fc1ce429eda8b8a7d210899078a762ded4f4"' : 'data-bs-target="#xs-injectables-links-module-ContentModule-07856a5ed1ec8560bc14ec6c668ee2d3fc460bba0cdc319e9b84a18a6e78890f0295b26eaba2a7c2037714dee651fc1ce429eda8b8a7d210899078a762ded4f4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContentModule-07856a5ed1ec8560bc14ec6c668ee2d3fc460bba0cdc319e9b84a18a6e78890f0295b26eaba2a7c2037714dee651fc1ce429eda8b8a7d210899078a762ded4f4"' :
                                        'id="xs-injectables-links-module-ContentModule-07856a5ed1ec8560bc14ec6c668ee2d3fc460bba0cdc319e9b84a18a6e78890f0295b26eaba2a7c2037714dee651fc1ce429eda8b8a7d210899078a762ded4f4"' }>
                                        <li class="link">
                                            <a href="injectables/ContentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DownloadsModule.html" data-type="entity-link" >DownloadsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DownloadsModule-03ee211c04a1ed6808bab59ddd7acf72db01bcb05518f374008f34f7c25086d8945f773df4f7df51b299f700fd8e9e9dd428c077ba6989fc9c912efb00940f60"' : 'data-bs-target="#xs-injectables-links-module-DownloadsModule-03ee211c04a1ed6808bab59ddd7acf72db01bcb05518f374008f34f7c25086d8945f773df4f7df51b299f700fd8e9e9dd428c077ba6989fc9c912efb00940f60"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DownloadsModule-03ee211c04a1ed6808bab59ddd7acf72db01bcb05518f374008f34f7c25086d8945f773df4f7df51b299f700fd8e9e9dd428c077ba6989fc9c912efb00940f60"' :
                                        'id="xs-injectables-links-module-DownloadsModule-03ee211c04a1ed6808bab59ddd7acf72db01bcb05518f374008f34f7c25086d8945f773df4f7df51b299f700fd8e9e9dd428c077ba6989fc9c912efb00940f60"' }>
                                        <li class="link">
                                            <a href="injectables/DownloadsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DownloadsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmailsModule.html" data-type="entity-link" >EmailsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' : 'data-bs-target="#xs-controllers-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' :
                                            'id="xs-controllers-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' }>
                                            <li class="link">
                                                <a href="controllers/EmailsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' : 'data-bs-target="#xs-injectables-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' :
                                        'id="xs-injectables-links-module-EmailsModule-3fb236543e064e9e110996644146f454ee575cc2c4ac7302fb6828a6be66307ae5c1a72d7c209dfedbeb24e7553b495d4f9afc4369f658117cdf6d51d40fd6f8"' }>
                                        <li class="link">
                                            <a href="injectables/EmailsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EntrepreneurModule.html" data-type="entity-link" >EntrepreneurModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EntrepreneurModule-27dd0360819e4ccc8456faac12c9a098efc72d237c3588e0fc37fbd86aeb28dbed3afdeb013ddfa21fcb22962bb7aff29926e8e4799d326c477f23b6d39918b4"' : 'data-bs-target="#xs-injectables-links-module-EntrepreneurModule-27dd0360819e4ccc8456faac12c9a098efc72d237c3588e0fc37fbd86aeb28dbed3afdeb013ddfa21fcb22962bb7aff29926e8e4799d326c477f23b6d39918b4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EntrepreneurModule-27dd0360819e4ccc8456faac12c9a098efc72d237c3588e0fc37fbd86aeb28dbed3afdeb013ddfa21fcb22962bb7aff29926e8e4799d326c477f23b6d39918b4"' :
                                        'id="xs-injectables-links-module-EntrepreneurModule-27dd0360819e4ccc8456faac12c9a098efc72d237c3588e0fc37fbd86aeb28dbed3afdeb013ddfa21fcb22962bb7aff29926e8e4799d326c477f23b6d39918b4"' }>
                                        <li class="link">
                                            <a href="injectables/EntrepreneurService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EntrepreneurService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EvaluationsModule.html" data-type="entity-link" >EvaluationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EvaluationsModule-c5ebbdc5adc512f1d12810b5dd199845d0a4590575d6fc07b661b0123b8dfdf916750dffba328c9e24a09250ef1ef917a74fb0976452ec41c84a7ddb714e59c5"' : 'data-bs-target="#xs-injectables-links-module-EvaluationsModule-c5ebbdc5adc512f1d12810b5dd199845d0a4590575d6fc07b661b0123b8dfdf916750dffba328c9e24a09250ef1ef917a74fb0976452ec41c84a7ddb714e59c5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EvaluationsModule-c5ebbdc5adc512f1d12810b5dd199845d0a4590575d6fc07b661b0123b8dfdf916750dffba328c9e24a09250ef1ef917a74fb0976452ec41c84a7ddb714e59c5"' :
                                        'id="xs-injectables-links-module-EvaluationsModule-c5ebbdc5adc512f1d12810b5dd199845d0a4590575d6fc07b661b0123b8dfdf916750dffba328c9e24a09250ef1ef917a74fb0976452ec41c84a7ddb714e59c5"' }>
                                        <li class="link">
                                            <a href="injectables/EvaluationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvaluationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventsModule.html" data-type="entity-link" >EventsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EventsModule-7788e4e22dd805d8dd21bd47abda65b654ead5ace2e7450d83ca264399b164fd63f731910a870142a182cd53186d72ea9be2f2183eab7fa015a986a046607b78"' : 'data-bs-target="#xs-injectables-links-module-EventsModule-7788e4e22dd805d8dd21bd47abda65b654ead5ace2e7450d83ca264399b164fd63f731910a870142a182cd53186d72ea9be2f2183eab7fa015a986a046607b78"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EventsModule-7788e4e22dd805d8dd21bd47abda65b654ead5ace2e7450d83ca264399b164fd63f731910a870142a182cd53186d72ea9be2f2183eab7fa015a986a046607b78"' :
                                        'id="xs-injectables-links-module-EventsModule-7788e4e22dd805d8dd21bd47abda65b654ead5ace2e7450d83ca264399b164fd63f731910a870142a182cd53186d72ea9be2f2183eab7fa015a986a046607b78"' }>
                                        <li class="link">
                                            <a href="injectables/EventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ExpertModule.html" data-type="entity-link" >ExpertModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ExpertModule-51ad0cd97506694a6a5c5b4f4a15c3b47f278b219ff0a67ebe7629faaa3c25c228c42c47cda2fe747f08dfed6da13907b2e91f8d1553ddefd66c6f9ea8f61bb3"' : 'data-bs-target="#xs-injectables-links-module-ExpertModule-51ad0cd97506694a6a5c5b4f4a15c3b47f278b219ff0a67ebe7629faaa3c25c228c42c47cda2fe747f08dfed6da13907b2e91f8d1553ddefd66c6f9ea8f61bb3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ExpertModule-51ad0cd97506694a6a5c5b4f4a15c3b47f278b219ff0a67ebe7629faaa3c25c228c42c47cda2fe747f08dfed6da13907b2e91f8d1553ddefd66c6f9ea8f61bb3"' :
                                        'id="xs-injectables-links-module-ExpertModule-51ad0cd97506694a6a5c5b4f4a15c3b47f278b219ff0a67ebe7629faaa3c25c228c42c47cda2fe747f08dfed6da13907b2e91f8d1553ddefd66c6f9ea8f61bb3"' }>
                                        <li class="link">
                                            <a href="injectables/ExpertService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpertService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FormsModule.html" data-type="entity-link" >FormsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FormsModule-a23b5f46879efabcaeff112b4a79d45e63c84f2ec704fb6a6805d547ecfda1d321ab458188bef7d0c06fbe84020cff5c162f692c47262ac7d8291ef4d95499f2"' : 'data-bs-target="#xs-injectables-links-module-FormsModule-a23b5f46879efabcaeff112b4a79d45e63c84f2ec704fb6a6805d547ecfda1d321ab458188bef7d0c06fbe84020cff5c162f692c47262ac7d8291ef4d95499f2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FormsModule-a23b5f46879efabcaeff112b4a79d45e63c84f2ec704fb6a6805d547ecfda1d321ab458188bef7d0c06fbe84020cff5c162f692c47262ac7d8291ef4d95499f2"' :
                                        'id="xs-injectables-links-module-FormsModule-a23b5f46879efabcaeff112b4a79d45e63c84f2ec704fb6a6805d547ecfda1d321ab458188bef7d0c06fbe84020cff5c162f692c47262ac7d8291ef4d95499f2"' }>
                                        <li class="link">
                                            <a href="injectables/FormSubscriptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormSubscriptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FormTagService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormTagService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FormsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelpDeskModule.html" data-type="entity-link" >HelpDeskModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HelpDeskModule-ea2b8c8d2687b9634eca99ad3740fd381e2d9f111c21cf4aaaa7e3cd3039258a6417f8e6a1e42673716e0e87367b05b44a2915238fad2bc1a40c80db3fa3d471"' : 'data-bs-target="#xs-injectables-links-module-HelpDeskModule-ea2b8c8d2687b9634eca99ad3740fd381e2d9f111c21cf4aaaa7e3cd3039258a6417f8e6a1e42673716e0e87367b05b44a2915238fad2bc1a40c80db3fa3d471"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelpDeskModule-ea2b8c8d2687b9634eca99ad3740fd381e2d9f111c21cf4aaaa7e3cd3039258a6417f8e6a1e42673716e0e87367b05b44a2915238fad2bc1a40c80db3fa3d471"' :
                                        'id="xs-injectables-links-module-HelpDeskModule-ea2b8c8d2687b9634eca99ad3740fd381e2d9f111c21cf4aaaa7e3cd3039258a6417f8e6a1e42673716e0e87367b05b44a2915238fad2bc1a40c80db3fa3d471"' }>
                                        <li class="link">
                                            <a href="injectables/HelpDeskService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HelpDeskService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/IntegrationsModule.html" data-type="entity-link" >IntegrationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-IntegrationsModule-70b62b2e40fabd209ccac2ee79ed0f0b612372f3fdcb4e88409d8c53e8aa79f344ddf2e116d23651cff39f25c6d0cd4e1abc216b94bc93c75b28eea440125706"' : 'data-bs-target="#xs-injectables-links-module-IntegrationsModule-70b62b2e40fabd209ccac2ee79ed0f0b612372f3fdcb4e88409d8c53e8aa79f344ddf2e116d23651cff39f25c6d0cd4e1abc216b94bc93c75b28eea440125706"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IntegrationsModule-70b62b2e40fabd209ccac2ee79ed0f0b612372f3fdcb4e88409d8c53e8aa79f344ddf2e116d23651cff39f25c6d0cd4e1abc216b94bc93c75b28eea440125706"' :
                                        'id="xs-injectables-links-module-IntegrationsModule-70b62b2e40fabd209ccac2ee79ed0f0b612372f3fdcb4e88409d8c53e8aa79f344ddf2e116d23651cff39f25c6d0cd4e1abc216b94bc93c75b28eea440125706"' }>
                                        <li class="link">
                                            <a href="injectables/IntegrationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntegrationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/InvitationsModule.html" data-type="entity-link" >InvitationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' : 'data-bs-target="#xs-controllers-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' :
                                            'id="xs-controllers-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' }>
                                            <li class="link">
                                                <a href="controllers/InvitationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvitationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' : 'data-bs-target="#xs-injectables-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' :
                                        'id="xs-injectables-links-module-InvitationsModule-5e7e35af552619d4e617b9d7e1ff988d4021c54b005cac6fb9633a08e1db0e6427ffe4551e288c0a401de5ee8ad84ff148e188541899e1a53de82a250fbf19ec"' }>
                                        <li class="link">
                                            <a href="injectables/InvitationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvitationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoggerModule.html" data-type="entity-link" >LoggerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NotificationsModule-9ba66ad5001f6e7b594416246b148ae86f2295582e525634c15667b1e9ade7b4ac1714703bea1d6b45df1edc581e4582c27e32bd03321126ab6e78388d6fe6aa"' : 'data-bs-target="#xs-injectables-links-module-NotificationsModule-9ba66ad5001f6e7b594416246b148ae86f2295582e525634c15667b1e9ade7b4ac1714703bea1d6b45df1edc581e4582c27e32bd03321126ab6e78388d6fe6aa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-9ba66ad5001f6e7b594416246b148ae86f2295582e525634c15667b1e9ade7b4ac1714703bea1d6b45df1edc581e4582c27e32bd03321126ab6e78388d6fe6aa"' :
                                        'id="xs-injectables-links-module-NotificationsModule-9ba66ad5001f6e7b594416246b148ae86f2295582e525634c15667b1e9ade7b4ac1714703bea1d6b45df1edc581e4582c27e32bd03321126ab6e78388d6fe6aa"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParticipationEventsModule.html" data-type="entity-link" >ParticipationEventsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ParticipationEventsModule-76c6aaf46fa67a6029946c612cecf9c27b342fc1ebf552407c215e713cf204a960813c09638995750d883a7bd1adb8f9fc9ffcd8e175ac3de57c7adbef063743"' : 'data-bs-target="#xs-injectables-links-module-ParticipationEventsModule-76c6aaf46fa67a6029946c612cecf9c27b342fc1ebf552407c215e713cf204a960813c09638995750d883a7bd1adb8f9fc9ffcd8e175ac3de57c7adbef063743"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ParticipationEventsModule-76c6aaf46fa67a6029946c612cecf9c27b342fc1ebf552407c215e713cf204a960813c09638995750d883a7bd1adb8f9fc9ffcd8e175ac3de57c7adbef063743"' :
                                        'id="xs-injectables-links-module-ParticipationEventsModule-76c6aaf46fa67a6029946c612cecf9c27b342fc1ebf552407c215e713cf204a960813c09638995750d883a7bd1adb8f9fc9ffcd8e175ac3de57c7adbef063743"' }>
                                        <li class="link">
                                            <a href="injectables/ParticipationEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParticipationEventsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PhasesModule.html" data-type="entity-link" >PhasesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PhasesModule-af263efd8b369d9c43a4c66beec4990d8d81ebdeb64b65b7984d6da5bfee5e7ca36ffb2041a4fe922b9ad0953dfb72134278019065458bd82086f58dcd5ea240"' : 'data-bs-target="#xs-injectables-links-module-PhasesModule-af263efd8b369d9c43a4c66beec4990d8d81ebdeb64b65b7984d6da5bfee5e7ca36ffb2041a4fe922b9ad0953dfb72134278019065458bd82086f58dcd5ea240"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PhasesModule-af263efd8b369d9c43a4c66beec4990d8d81ebdeb64b65b7984d6da5bfee5e7ca36ffb2041a4fe922b9ad0953dfb72134278019065458bd82086f58dcd5ea240"' :
                                        'id="xs-injectables-links-module-PhasesModule-af263efd8b369d9c43a4c66beec4990d8d81ebdeb64b65b7984d6da5bfee5e7ca36ffb2041a4fe922b9ad0953dfb72134278019065458bd82086f58dcd5ea240"' }>
                                        <li class="link">
                                            <a href="injectables/PhasesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhasesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResourcesModule.html" data-type="entity-link" >ResourcesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ResourcesModule-f5760b1d9be8ad333c1d9bcca28dae950799a20b714595e137571bb12a4279e54851f01a316869c085fe62422dc0a7edd59f3dec06f84348a8e8383dc4fa0e18"' : 'data-bs-target="#xs-injectables-links-module-ResourcesModule-f5760b1d9be8ad333c1d9bcca28dae950799a20b714595e137571bb12a4279e54851f01a316869c085fe62422dc0a7edd59f3dec06f84348a8e8383dc4fa0e18"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResourcesModule-f5760b1d9be8ad333c1d9bcca28dae950799a20b714595e137571bb12a4279e54851f01a316869c085fe62422dc0a7edd59f3dec06f84348a8e8383dc4fa0e18"' :
                                        'id="xs-injectables-links-module-ResourcesModule-f5760b1d9be8ad333c1d9bcca28dae950799a20b714595e137571bb12a4279e54851f01a316869c085fe62422dc0a7edd59f3dec06f84348a8e8383dc4fa0e18"' }>
                                        <li class="link">
                                            <a href="injectables/ResourcesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourcesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResourcesRepliesModule.html" data-type="entity-link" >ResourcesRepliesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ResourcesRepliesModule-7b94f13363367f9b9068e145568010026b75dd2fa990edda4e2b55c3aceb4e8a23bdd9e3e4cc67bf96177319e6b51d31585a580f2472fbefe4a968145904fee3"' : 'data-bs-target="#xs-injectables-links-module-ResourcesRepliesModule-7b94f13363367f9b9068e145568010026b75dd2fa990edda4e2b55c3aceb4e8a23bdd9e3e4cc67bf96177319e6b51d31585a580f2472fbefe4a968145904fee3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResourcesRepliesModule-7b94f13363367f9b9068e145568010026b75dd2fa990edda4e2b55c3aceb4e8a23bdd9e3e4cc67bf96177319e6b51d31585a580f2472fbefe4a968145904fee3"' :
                                        'id="xs-injectables-links-module-ResourcesRepliesModule-7b94f13363367f9b9068e145568010026b75dd2fa990edda4e2b55c3aceb4e8a23bdd9e3e4cc67bf96177319e6b51d31585a580f2472fbefe4a968145904fee3"' }>
                                        <li class="link">
                                            <a href="injectables/ResourcesRepliesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourcesRepliesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RolModule.html" data-type="entity-link" >RolModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RolModule-cc52183b497871f2782008f53ccb862d20b96933e11c655d9f79f1adaaa26a05ea89b6d86f4c289cdc97d3a5402ae1b395e269b00a1cb33ba7ff1cdc50f16b6a"' : 'data-bs-target="#xs-injectables-links-module-RolModule-cc52183b497871f2782008f53ccb862d20b96933e11c655d9f79f1adaaa26a05ea89b6d86f4c289cdc97d3a5402ae1b395e269b00a1cb33ba7ff1cdc50f16b6a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RolModule-cc52183b497871f2782008f53ccb862d20b96933e11c655d9f79f1adaaa26a05ea89b6d86f4c289cdc97d3a5402ae1b395e269b00a1cb33ba7ff1cdc50f16b6a"' :
                                        'id="xs-injectables-links-module-RolModule-cc52183b497871f2782008f53ccb862d20b96933e11c655d9f79f1adaaa26a05ea89b6d86f4c289cdc97d3a5402ae1b395e269b00a1cb33ba7ff1cdc50f16b6a"' }>
                                        <li class="link">
                                            <a href="injectables/RolService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SitesModule.html" data-type="entity-link" >SitesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SitesModule-f0c2c94f3d370236103edf1b4b4b8fceb7dbcf0e73ada4b1022a079f092f27a5052cb3887b55311f53adaaf0827d5f84c63e199365f8536d91bc2e13178bd176"' : 'data-bs-target="#xs-injectables-links-module-SitesModule-f0c2c94f3d370236103edf1b4b4b8fceb7dbcf0e73ada4b1022a079f092f27a5052cb3887b55311f53adaaf0827d5f84c63e199365f8536d91bc2e13178bd176"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SitesModule-f0c2c94f3d370236103edf1b4b4b8fceb7dbcf0e73ada4b1022a079f092f27a5052cb3887b55311f53adaaf0827d5f84c63e199365f8536d91bc2e13178bd176"' :
                                        'id="xs-injectables-links-module-SitesModule-f0c2c94f3d370236103edf1b4b4b8fceb7dbcf0e73ada4b1022a079f092f27a5052cb3887b55311f53adaaf0827d5f84c63e199365f8536d91bc2e13178bd176"' }>
                                        <li class="link">
                                            <a href="injectables/SitesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SitesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StagesModule.html" data-type="entity-link" >StagesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StagesModule-72b93691c1dbed233ca463d9fcc8504b8c7ce9f33d1dacbea20bacc6b51f214ae592a91fc07677f05a059abf81525f9c871516699d00f59c3419fc4cd9b02894"' : 'data-bs-target="#xs-injectables-links-module-StagesModule-72b93691c1dbed233ca463d9fcc8504b8c7ce9f33d1dacbea20bacc6b51f214ae592a91fc07677f05a059abf81525f9c871516699d00f59c3419fc4cd9b02894"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StagesModule-72b93691c1dbed233ca463d9fcc8504b8c7ce9f33d1dacbea20bacc6b51f214ae592a91fc07677f05a059abf81525f9c871516699d00f59c3419fc4cd9b02894"' :
                                        'id="xs-injectables-links-module-StagesModule-72b93691c1dbed233ca463d9fcc8504b8c7ce9f33d1dacbea20bacc6b51f214ae592a91fc07677f05a059abf81525f9c871516699d00f59c3419fc4cd9b02894"' }>
                                        <li class="link">
                                            <a href="injectables/StagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StartupModule.html" data-type="entity-link" >StartupModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StartupModule-1dbc3952adedfe8de386729306623c9795164a6d440e6d1032b96f26abba94e6665f2f006edbd7b27f870e56e3bf2dff6f7cd511066410a29466239a31bae81b"' : 'data-bs-target="#xs-injectables-links-module-StartupModule-1dbc3952adedfe8de386729306623c9795164a6d440e6d1032b96f26abba94e6665f2f006edbd7b27f870e56e3bf2dff6f7cd511066410a29466239a31bae81b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StartupModule-1dbc3952adedfe8de386729306623c9795164a6d440e6d1032b96f26abba94e6665f2f006edbd7b27f870e56e3bf2dff6f7cd511066410a29466239a31bae81b"' :
                                        'id="xs-injectables-links-module-StartupModule-1dbc3952adedfe8de386729306623c9795164a6d440e6d1032b96f26abba94e6665f2f006edbd7b27f870e56e3bf2dff6f7cd511066410a29466239a31bae81b"' }>
                                        <li class="link">
                                            <a href="injectables/StartupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartupService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StorageModule.html" data-type="entity-link" >StorageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-StorageModule-04a0c4c725ef55a30e8e9290af7c8bdbb2d2f6e9e19f1f655c155964007575f47172e70d7f0eec138e372077a71b98f9fbab2a7509618dfaab32a39c09614e91"' : 'data-bs-target="#xs-controllers-links-module-StorageModule-04a0c4c725ef55a30e8e9290af7c8bdbb2d2f6e9e19f1f655c155964007575f47172e70d7f0eec138e372077a71b98f9fbab2a7509618dfaab32a39c09614e91"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StorageModule-04a0c4c725ef55a30e8e9290af7c8bdbb2d2f6e9e19f1f655c155964007575f47172e70d7f0eec138e372077a71b98f9fbab2a7509618dfaab32a39c09614e91"' :
                                            'id="xs-controllers-links-module-StorageModule-04a0c4c725ef55a30e8e9290af7c8bdbb2d2f6e9e19f1f655c155964007575f47172e70d7f0eec138e372077a71b98f9fbab2a7509618dfaab32a39c09614e91"' }>
                                            <li class="link">
                                                <a href="controllers/StorageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StorageController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TableModule.html" data-type="entity-link" >TableModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TableModule-e6cd0ecdf58bda445351a0a8d8e0f1237e703595a19a6a9fbbd14cf325ca9ff6f68c02dc86a04b7579080477f239111e304024669babd47da4a3bc6c0f7170c7"' : 'data-bs-target="#xs-injectables-links-module-TableModule-e6cd0ecdf58bda445351a0a8d8e0f1237e703595a19a6a9fbbd14cf325ca9ff6f68c02dc86a04b7579080477f239111e304024669babd47da4a3bc6c0f7170c7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TableModule-e6cd0ecdf58bda445351a0a8d8e0f1237e703595a19a6a9fbbd14cf325ca9ff6f68c02dc86a04b7579080477f239111e304024669babd47da4a3bc6c0f7170c7"' :
                                        'id="xs-injectables-links-module-TableModule-e6cd0ecdf58bda445351a0a8d8e0f1237e703595a19a6a9fbbd14cf325ca9ff6f68c02dc86a04b7579080477f239111e304024669babd47da4a3bc6c0f7170c7"' }>
                                        <li class="link">
                                            <a href="injectables/TableConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableConfigService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TableService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TermsOfUseModule.html" data-type="entity-link" >TermsOfUseModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TermsOfUseModule-1d872e0880f3c197862e955d8256205742289f16f64e587ec36bbbab97ec76615bfd7e4af40d768301609794a93a845e213695645a72e5a993c7f9057ba995c3"' : 'data-bs-target="#xs-injectables-links-module-TermsOfUseModule-1d872e0880f3c197862e955d8256205742289f16f64e587ec36bbbab97ec76615bfd7e4af40d768301609794a93a845e213695645a72e5a993c7f9057ba995c3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TermsOfUseModule-1d872e0880f3c197862e955d8256205742289f16f64e587ec36bbbab97ec76615bfd7e4af40d768301609794a93a845e213695645a72e5a993c7f9057ba995c3"' :
                                        'id="xs-injectables-links-module-TermsOfUseModule-1d872e0880f3c197862e955d8256205742289f16f64e587ec36bbbab97ec76615bfd7e4af40d768301609794a93a845e213695645a72e5a993c7f9057ba995c3"' }>
                                        <li class="link">
                                            <a href="injectables/TermsOfUseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermsOfUseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TicketCategoriesModule.html" data-type="entity-link" >TicketCategoriesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TicketCategoriesModule-3074659803bf46cbb2c28f92af2904e9150684db95e0543ebb5f7296e76f743e3ad3632280ed1a548cf25729fab6da68e579ac3415c5c4287ca7894633d9ed49"' : 'data-bs-target="#xs-injectables-links-module-TicketCategoriesModule-3074659803bf46cbb2c28f92af2904e9150684db95e0543ebb5f7296e76f743e3ad3632280ed1a548cf25729fab6da68e579ac3415c5c4287ca7894633d9ed49"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TicketCategoriesModule-3074659803bf46cbb2c28f92af2904e9150684db95e0543ebb5f7296e76f743e3ad3632280ed1a548cf25729fab6da68e579ac3415c5c4287ca7894633d9ed49"' :
                                        'id="xs-injectables-links-module-TicketCategoriesModule-3074659803bf46cbb2c28f92af2904e9150684db95e0543ebb5f7296e76f743e3ad3632280ed1a548cf25729fab6da68e579ac3415c5c4287ca7894633d9ed49"' }>
                                        <li class="link">
                                            <a href="injectables/TicketCategoriesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TicketCategoriesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TypesEventsModule.html" data-type="entity-link" >TypesEventsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TypesEventsModule-cbb545739fc5b03ad0933abda2480deff251d2eca8d3e4bdc16471692ddd62a18d380a80878eb60765aa8c7c09cd7d9e7da274fa595925d5d4ebee055a0e7ebe"' : 'data-bs-target="#xs-injectables-links-module-TypesEventsModule-cbb545739fc5b03ad0933abda2480deff251d2eca8d3e4bdc16471692ddd62a18d380a80878eb60765aa8c7c09cd7d9e7da274fa595925d5d4ebee055a0e7ebe"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TypesEventsModule-cbb545739fc5b03ad0933abda2480deff251d2eca8d3e4bdc16471692ddd62a18d380a80878eb60765aa8c7c09cd7d9e7da274fa595925d5d4ebee055a0e7ebe"' :
                                        'id="xs-injectables-links-module-TypesEventsModule-cbb545739fc5b03ad0933abda2480deff251d2eca8d3e4bdc16471692ddd62a18d380a80878eb60765aa8c7c09cd7d9e7da274fa595925d5d4ebee055a0e7ebe"' }>
                                        <li class="link">
                                            <a href="injectables/TypesEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TypesEventsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TypesNotificationsModule.html" data-type="entity-link" >TypesNotificationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TypesNotificationsModule-0819a199adefe88531ac71fac67b0e509e69b22773b732fa7cbcc851746394697c5442b5fb74a90b8b3eb7e0c24efd5db8bdcdd5d3417292a7cd261124474b46"' : 'data-bs-target="#xs-injectables-links-module-TypesNotificationsModule-0819a199adefe88531ac71fac67b0e509e69b22773b732fa7cbcc851746394697c5442b5fb74a90b8b3eb7e0c24efd5db8bdcdd5d3417292a7cd261124474b46"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TypesNotificationsModule-0819a199adefe88531ac71fac67b0e509e69b22773b732fa7cbcc851746394697c5442b5fb74a90b8b3eb7e0c24efd5db8bdcdd5d3417292a7cd261124474b46"' :
                                        'id="xs-injectables-links-module-TypesNotificationsModule-0819a199adefe88531ac71fac67b0e509e69b22773b732fa7cbcc851746394697c5442b5fb74a90b8b3eb7e0c24efd5db8bdcdd5d3417292a7cd261124474b46"' }>
                                        <li class="link">
                                            <a href="injectables/TypesNotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TypesNotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserConfigModule.html" data-type="entity-link" >UserConfigModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserConfigModule-7cffa774ed9b134b1dd3f1828f951dbfa52742d49674b82182494a8aa815ec7938f3fd0034d2b300c66606eb62de1500257fa2c85cd32424cb1c778efb02f3c9"' : 'data-bs-target="#xs-injectables-links-module-UserConfigModule-7cffa774ed9b134b1dd3f1828f951dbfa52742d49674b82182494a8aa815ec7938f3fd0034d2b300c66606eb62de1500257fa2c85cd32424cb1c778efb02f3c9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserConfigModule-7cffa774ed9b134b1dd3f1828f951dbfa52742d49674b82182494a8aa815ec7938f3fd0034d2b300c66606eb62de1500257fa2c85cd32424cb1c778efb02f3c9"' :
                                        'id="xs-injectables-links-module-UserConfigModule-7cffa774ed9b134b1dd3f1828f951dbfa52742d49674b82182494a8aa815ec7938f3fd0034d2b300c66606eb62de1500257fa2c85cd32424cb1c778efb02f3c9"' }>
                                        <li class="link">
                                            <a href="injectables/UserConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserLogModule.html" data-type="entity-link" >UserLogModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserLogModule-b85c27639d0cc15bfc36b4cc6d20644e4deb37c741e2cdcff62c8082a9218b548496afef8a01e8562fdea3c3e33b47b699a931e0fafd7d38d373a1366651d028"' : 'data-bs-target="#xs-injectables-links-module-UserLogModule-b85c27639d0cc15bfc36b4cc6d20644e4deb37c741e2cdcff62c8082a9218b548496afef8a01e8562fdea3c3e33b47b699a931e0fafd7d38d373a1366651d028"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserLogModule-b85c27639d0cc15bfc36b4cc6d20644e4deb37c741e2cdcff62c8082a9218b548496afef8a01e8562fdea3c3e33b47b699a931e0fafd7d38d373a1366651d028"' :
                                        'id="xs-injectables-links-module-UserLogModule-b85c27639d0cc15bfc36b4cc6d20644e4deb37c741e2cdcff62c8082a9218b548496afef8a01e8562fdea3c3e33b47b699a931e0fafd7d38d373a1366651d028"' }>
                                        <li class="link">
                                            <a href="injectables/UserLogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserLogService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-2f613bd06bd49454c43dfdcdc9c3be57f0f78487f963969bae36e627cd0d2f8ce930e90c7e8d753a42f4cc1dbfeed8c9384514b864bba9092f2e93fd4051d69e"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-2f613bd06bd49454c43dfdcdc9c3be57f0f78487f963969bae36e627cd0d2f8ce930e90c7e8d753a42f4cc1dbfeed8c9384514b864bba9092f2e93fd4051d69e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-2f613bd06bd49454c43dfdcdc9c3be57f0f78487f963969bae36e627cd0d2f8ce930e90c7e8d753a42f4cc1dbfeed8c9384514b864bba9092f2e93fd4051d69e"' :
                                        'id="xs-injectables-links-module-UsersModule-2f613bd06bd49454c43dfdcdc9c3be57f0f78487f963969bae36e627cd0d2f8ce930e90c7e8d753a42f4cc1dbfeed8c9384514b864bba9092f2e93fd4051d69e"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/EmailsController.html" data-type="entity-link" >EmailsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/InvitationsController.html" data-type="entity-link" >InvitationsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/StorageController.html" data-type="entity-link" >StorageController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AcceptInvitationDto.html" data-type="entity-link" >AcceptInvitationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Acta.html" data-type="entity-link" >Acta</a>
                            </li>
                            <li class="link">
                                <a href="classes/activities.html" data-type="entity-link" >activities</a>
                            </li>
                            <li class="link">
                                <a href="classes/ActivitiesConfig.html" data-type="entity-link" >ActivitiesConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTableJoinInput.html" data-type="entity-link" >AddTableJoinInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Announcement.html" data-type="entity-link" >Announcement</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnnouncementApplicantArgs.html" data-type="entity-link" >AnnouncementApplicantArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnnouncementApplicantsArgs.html" data-type="entity-link" >AnnouncementApplicantsArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/Applicant.html" data-type="entity-link" >Applicant</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplicantArgs.html" data-type="entity-link" >ApplicantArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplicantState.html" data-type="entity-link" >ApplicantState</a>
                            </li>
                            <li class="link">
                                <a href="classes/Assign.html" data-type="entity-link" >Assign</a>
                            </li>
                            <li class="link">
                                <a href="classes/Attachment.html" data-type="entity-link" >Attachment</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttachmentSubmit.html" data-type="entity-link" >AttachmentSubmit</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthCode.html" data-type="entity-link" >AuthCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/AWSSESProvider.html" data-type="entity-link" >AWSSESProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/Business.html" data-type="entity-link" >Business</a>
                            </li>
                            <li class="link">
                                <a href="classes/BusinessRelationship.html" data-type="entity-link" >BusinessRelationship</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloseFormSubscriptionArgs.html" data-type="entity-link" >CloseFormSubscriptionArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ColumnGroup.html" data-type="entity-link" >ColumnGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigEvaluation.html" data-type="entity-link" >ConfigEvaluation</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigurationApp.html" data-type="entity-link" >ConfigurationApp</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactArgs.html" data-type="entity-link" >ContactArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactServiceLink.html" data-type="entity-link" >ContactServiceLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactServicesInput.html" data-type="entity-link" >ContactServicesInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Content.html" data-type="entity-link" >Content</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateActaInput.html" data-type="entity-link" >CreateActaInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateActivitiesConfigInput.html" data-type="entity-link" >CreateActivitiesConfigInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAnnouncementInput.html" data-type="entity-link" >CreateAnnouncementInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConfigEvaluationInput.html" data-type="entity-link" >CreateConfigEvaluationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConfigNotificationInput.html" data-type="entity-link" >CreateConfigNotificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateContentInput.html" data-type="entity-link" >CreateContentInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEventInput.html" data-type="entity-link" >CreateEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFormInput.html" data-type="entity-link" >CreateFormInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFormSubscriptionInput.html" data-type="entity-link" >CreateFormSubscriptionInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateFormTagInput.html" data-type="entity-link" >CreateFormTagInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateHelpDeskInput.html" data-type="entity-link" >CreateHelpDeskInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateIntegrationInput.html" data-type="entity-link" >CreateIntegrationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateInvitationArgs.html" data-type="entity-link" >CreateInvitationArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNotificationInput.html" data-type="entity-link" >CreateNotificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateParticipationEventInput.html" data-type="entity-link" >CreateParticipationEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePhaseInput.html" data-type="entity-link" >CreatePhaseInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResourceInput.html" data-type="entity-link" >CreateResourceInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResourcesReplyInput.html" data-type="entity-link" >CreateResourcesReplyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRolInput.html" data-type="entity-link" >CreateRolInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSiteInput.html" data-type="entity-link" >CreateSiteInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateStageInput.html" data-type="entity-link" >CreateStageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableConfigInput.html" data-type="entity-link" >CreateTableConfigInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTableInput.html" data-type="entity-link" >CreateTableInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTypesEventInput.html" data-type="entity-link" >CreateTypesEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserInput.html" data-type="entity-link" >CreateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserLogInput.html" data-type="entity-link" >CreateUserLogInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Download.html" data-type="entity-link" >Download</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entrepreneur.html" data-type="entity-link" >Entrepreneur</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntrepreneurRelationship.html" data-type="entity-link" >EntrepreneurRelationship</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntrepreneurRelationship-1.html" data-type="entity-link" >EntrepreneurRelationship</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntrepreneurStartupArgs.html" data-type="entity-link" >EntrepreneurStartupArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/Evaluation.html" data-type="entity-link" >Evaluation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Event.html" data-type="entity-link" >Event</a>
                            </li>
                            <li class="link">
                                <a href="classes/Expert.html" data-type="entity-link" >Expert</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExpertEventLink.html" data-type="entity-link" >ExpertEventLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindFormsArgs.html" data-type="entity-link" >FindFormsArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindInvitationArgs.html" data-type="entity-link" >FindInvitationArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindUsersArgs.html" data-type="entity-link" >FindUsersArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/Form.html" data-type="entity-link" >Form</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormSubmission.html" data-type="entity-link" >FormSubmission</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormSubmissionFiles.html" data-type="entity-link" >FormSubmissionFiles</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormSubscription.html" data-type="entity-link" >FormSubscription</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormTag.html" data-type="entity-link" >FormTag</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSubmittedFilesArgs.html" data-type="entity-link" >GetSubmittedFilesArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelpDeskFilterInput.html" data-type="entity-link" >HelpDeskFilterInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/HelpDeskTicket.html" data-type="entity-link" >HelpDeskTicket</a>
                            </li>
                            <li class="link">
                                <a href="classes/Hours.html" data-type="entity-link" >Hours</a>
                            </li>
                            <li class="link">
                                <a href="classes/Integration.html" data-type="entity-link" >Integration</a>
                            </li>
                            <li class="link">
                                <a href="classes/Invitation.html" data-type="entity-link" >Invitation</a>
                            </li>
                            <li class="link">
                                <a href="classes/LastContentOutput.html" data-type="entity-link" >LastContentOutput</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkExpertsToPhaseArgs.html" data-type="entity-link" >LinkExpertsToPhaseArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkStartupsExpertsArgs.html" data-type="entity-link" >LinkStartupsExpertsArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkStartupToPhaseArgs.html" data-type="entity-link" >LinkStartupToPhaseArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkWithTargetsArgs.html" data-type="entity-link" >LinkWithTargetsArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkWithTargetsByRequestArgs.html" data-type="entity-link" >LinkWithTargetsByRequestArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification-1.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/OthersInput.html" data-type="entity-link" >OthersInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipantEventLink.html" data-type="entity-link" >ParticipantEventLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipationEvent.html" data-type="entity-link" >ParticipationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/Phase.html" data-type="entity-link" >Phase</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhaseExpertRelationship.html" data-type="entity-link" >PhaseExpertRelationship</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhaseRelationship.html" data-type="entity-link" >PhaseRelationship</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rating.html" data-type="entity-link" >Rating</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveTableJoinInput.html" data-type="entity-link" >RemoveTableJoinInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Resource.html" data-type="entity-link" >Resource</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourcesReply.html" data-type="entity-link" >ResourcesReply</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rol.html" data-type="entity-link" >Rol</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchBatchInput.html" data-type="entity-link" >SearchBatchInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectApplicantsArgs.html" data-type="entity-link" >SelectApplicantsArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendEmailInput.html" data-type="entity-link" >SendEmailInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendGridProvider.html" data-type="entity-link" >SendGridProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpInput.html" data-type="entity-link" >SignUpInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Site.html" data-type="entity-link" >Site</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stage.html" data-type="entity-link" >Stage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Startup.html" data-type="entity-link" >Startup</a>
                            </li>
                            <li class="link">
                                <a href="classes/StartupLink.html" data-type="entity-link" >StartupLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/StartupRelationship.html" data-type="entity-link" >StartupRelationship</a>
                            </li>
                            <li class="link">
                                <a href="classes/StorageService.html" data-type="entity-link" >StorageService</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubmitAnnouncementDocInput.html" data-type="entity-link" >SubmitAnnouncementDocInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubmitFileInput.html" data-type="entity-link" >SubmitFileInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubmitFormSubscriptionArgs.html" data-type="entity-link" >SubmitFormSubscriptionArgs</a>
                            </li>
                            <li class="link">
                                <a href="classes/Table.html" data-type="entity-link" >Table</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableConfig.html" data-type="entity-link" >TableConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableJoin.html" data-type="entity-link" >TableJoin</a>
                            </li>
                            <li class="link">
                                <a href="classes/TeamCoachLink.html" data-type="entity-link" >TeamCoachLink</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemplateInput.html" data-type="entity-link" >TemplateInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/TermsOfUse.html" data-type="entity-link" >TermsOfUse</a>
                            </li>
                            <li class="link">
                                <a href="classes/TicketCategory.html" data-type="entity-link" >TicketCategory</a>
                            </li>
                            <li class="link">
                                <a href="classes/TicketChild.html" data-type="entity-link" >TicketChild</a>
                            </li>
                            <li class="link">
                                <a href="classes/TypesEvent.html" data-type="entity-link" >TypesEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/TypesNotification.html" data-type="entity-link" >TypesNotification</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateActaInput.html" data-type="entity-link" >UpdateActaInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateActivitiesConfigInput.html" data-type="entity-link" >UpdateActivitiesConfigInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAnnouncementInput.html" data-type="entity-link" >UpdateAnnouncementInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateApplicantInput.html" data-type="entity-link" >UpdateApplicantInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateApplicantStateInput.html" data-type="entity-link" >UpdateApplicantStateInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateConfigEvaluationInput.html" data-type="entity-link" >UpdateConfigEvaluationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateConfigurationAppInput.html" data-type="entity-link" >UpdateConfigurationAppInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateContentInput.html" data-type="entity-link" >UpdateContentInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEventInput.html" data-type="entity-link" >UpdateEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateExpertInput.html" data-type="entity-link" >UpdateExpertInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFormInput.html" data-type="entity-link" >UpdateFormInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateFormTagInput.html" data-type="entity-link" >UpdateFormTagInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateHelpDeskInput.html" data-type="entity-link" >UpdateHelpDeskInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateIntegrationInput.html" data-type="entity-link" >UpdateIntegrationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateNotificationInput.html" data-type="entity-link" >UpdateNotificationInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateParticipationEventInput.html" data-type="entity-link" >UpdateParticipationEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePhaseInput.html" data-type="entity-link" >UpdatePhaseInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResourceInput.html" data-type="entity-link" >UpdateResourceInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResourcesReplyInput.html" data-type="entity-link" >UpdateResourcesReplyInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRolInput.html" data-type="entity-link" >UpdateRolInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSiteInput.html" data-type="entity-link" >UpdateSiteInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStageInput.html" data-type="entity-link" >UpdateStageInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTableConfigInput.html" data-type="entity-link" >UpdateTableConfigInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTermsOfUseInput.html" data-type="entity-link" >UpdateTermsOfUseInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTypesEventInput.html" data-type="entity-link" >UpdateTypesEventInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserConfigInput.html" data-type="entity-link" >UpdateUserConfigInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserInput.html" data-type="entity-link" >UpdateUserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserConfig.html" data-type="entity-link" >UserConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLog.html" data-type="entity-link" >UserLog</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ActaService.html" data-type="entity-link" >ActaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ActivitiesConfigService.html" data-type="entity-link" >ActivitiesConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AnnouncementsService.html" data-type="entity-link" >AnnouncementsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApplicantService.html" data-type="entity-link" >ApplicantService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthCodeService.html" data-type="entity-link" >AuthCodeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AwsService.html" data-type="entity-link" >AwsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BusinessService.html" data-type="entity-link" >BusinessService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigEvaluationsService.html" data-type="entity-link" >ConfigEvaluationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigNotificationsService.html" data-type="entity-link" >ConfigNotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationAppService.html" data-type="entity-link" >ConfigurationAppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContentService.html" data-type="entity-link" >ContentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DownloadsService.html" data-type="entity-link" >DownloadsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailsService.html" data-type="entity-link" >EmailsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntrepreneurService.html" data-type="entity-link" >EntrepreneurService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EvaluationsService.html" data-type="entity-link" >EvaluationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventsService.html" data-type="entity-link" >EventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExpertService.html" data-type="entity-link" >ExpertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormsService.html" data-type="entity-link" >FormsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormSubscriptionService.html" data-type="entity-link" >FormSubscriptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormTagService.html" data-type="entity-link" >FormTagService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HelpDeskService.html" data-type="entity-link" >HelpDeskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IntegrationsService.html" data-type="entity-link" >IntegrationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InvitationsService.html" data-type="entity-link" >InvitationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ParticipationEventsService.html" data-type="entity-link" >ParticipationEventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhasesService.html" data-type="entity-link" >PhasesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResourcesRepliesService.html" data-type="entity-link" >ResourcesRepliesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResourcesService.html" data-type="entity-link" >ResourcesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RolService.html" data-type="entity-link" >RolService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SitesService.html" data-type="entity-link" >SitesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StagesService.html" data-type="entity-link" >StagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StartupService.html" data-type="entity-link" >StartupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TableConfigService.html" data-type="entity-link" >TableConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TableService.html" data-type="entity-link" >TableService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TermsOfUseService.html" data-type="entity-link" >TermsOfUseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TicketCategoriesService.html" data-type="entity-link" >TicketCategoriesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TypesEventsService.html" data-type="entity-link" >TypesEventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TypesNotificationsService.html" data-type="entity-link" >TypesNotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserConfigService.html" data-type="entity-link" >UserConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserLogService.html" data-type="entity-link" >UserLogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/GqlAuthGuard.html" data-type="entity-link" >GqlAuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/EmailsRepository.html" data-type="entity-link" >EmailsRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAttachment.html" data-type="entity-link" >IAttachment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/item_permission.html" data-type="entity-link" >item_permission</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});