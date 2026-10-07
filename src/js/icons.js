'use strict';

/*
 * Lucide icons: <gb-icon name="settings"></gb-icon>
 *
 * Only the icons listed here are bundled; add new ones to the map.
 */
import {
    ArrowRight,
    AtSign,
    BellRing,
    ChevronDown,
    CircleAlert,
    Download,
    Eye,
    EyeOff,
    Hash,
    History,
    ImagePlus,
    Info,
    Keyboard,
    LoaderCircle,
    Lock,
    LockOpen,
    Menu,
    MessagesSquare,
    Palette,
    Pin,
    Power,
    RefreshCw,
    Search,
    SendHorizontal,
    Server,
    Settings,
    SlidersHorizontal,
    TriangleAlert,
    Upload,
    User,
    Users,
    X,
    createElement,
} from 'lucide';

var ICONS = {
    'arrow-right': ArrowRight,
    'at-sign': AtSign,
    'bell-ring': BellRing,
    'chevron-down': ChevronDown,
    'circle-alert': CircleAlert,
    download: Download,
    eye: Eye,
    'eye-off': EyeOff,
    hash: Hash,
    history: History,
    'image-plus': ImagePlus,
    info: Info,
    keyboard: Keyboard,
    'loader-circle': LoaderCircle,
    lock: Lock,
    'lock-open': LockOpen,
    menu: Menu,
    'messages-square': MessagesSquare,
    palette: Palette,
    pin: Pin,
    power: Power,
    'refresh-cw': RefreshCw,
    search: Search,
    'send-horizontal': SendHorizontal,
    server: Server,
    settings: Settings,
    'sliders-horizontal': SlidersHorizontal,
    'triangle-alert': TriangleAlert,
    upload: Upload,
    user: User,
    users: Users,
    x: X,
};

var icons = angular.module('icons', []);

icons.directive('gbIcon', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            attrs.$observe('name', function (name) {
                var el = element[0];
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
                if (!(name in ICONS)) {
                    return;
                }
                el.appendChild(
                    createElement(ICONS[name], {
                        class: 'gb-icon-svg',
                        'aria-hidden': 'true',
                        focusable: 'false',
                    }),
                );
            });
        },
    };
});
