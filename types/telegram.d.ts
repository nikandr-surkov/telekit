// types/telegram.d.ts
export interface TelegramWebApp {
    initData: string;
    initDataUnsafe: WebAppInitData;
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: ThemeParams;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    bottomBarColor: string;
    isClosingConfirmationEnabled: boolean;
    isVerticalSwipesEnabled: boolean;
    isActive: boolean;
    isFullscreen: boolean;
    isOrientationLocked: boolean;

    MainButton: MainButton;
    SecondaryButton: SecondaryButton;
    BackButton: BackButton;
    SettingsButton: SettingsButton;
    HapticFeedback: HapticFeedback;
    CloudStorage: CloudStorage;
    BiometricManager: BiometricManager;
    Accelerometer: Accelerometer;
    DeviceOrientation: DeviceOrientation;
    Gyroscope: Gyroscope;
    LocationManager: LocationManager;

    // Methods
    ready(): void;
    expand(): void;
    close(): void;
    enableClosingConfirmation(): void;
    disableClosingConfirmation(): void;
    enableVerticalSwipes(): void;
    disableVerticalSwipes(): void;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
    setBottomBarColor(color: string): void;
    requestFullscreen(): void;
    exitFullscreen(): void;
    lockOrientation(): void;
    unlockOrientation(): void;
    requestWriteAccess(callback?: (granted: boolean) => void): void;
    requestContact(callback?: (sent: boolean, event?: any) => void): void;
    readTextFromClipboard(callback?: (text: string | null) => void): void;
    shareToStory(mediaUrl: string, params?: ShareStoryParams): void;
    downloadFile(params: DownloadFileParams, callback?: (downloaded: boolean) => void): void;
    addToHomeScreen(): void;
    checkHomeScreenStatus(callback?: (status: string) => void): void;
    openLink(url: string, options?: OpenLinkOptions): void;
    openTelegramLink(url: string, options?: any): void;
    openInvoice(url: string, callback?: (status: string) => void): void;
    showPopup(params: PopupParams, callback?: (buttonId: string | null) => void): void;
    showAlert(message: string, callback?: () => void): void;
    showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
    showScanQrPopup(params?: ScanQrPopupParams, callback?: (text: string) => boolean | void): void;
    isVersionAtLeast(version: string): boolean;
    setEmojiStatus(customEmojiId: string, params?: EmojiStatusParams, callback?: (set: boolean) => void): void;
    requestEmojiStatusAccess(callback?: (allowed: boolean) => void): void;
    sendData(data: string): void;
    switchInlineQuery(query: string, chooseChatTypes?: ChatType[]): void;
    invokeCustomMethod(method: string, params?: any, callback?: (err: string | null, result?: any) => void): void;

    onEvent(eventType: string, eventHandler: () => void): void;
    offEvent(eventType: string, eventHandler: () => void): void;
}

export interface WebAppInitData {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    chat?: WebAppChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
}

export interface WebAppUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

export interface WebAppChat {
    id: number;
    type: string;
    title: string;
    username?: string;
    photo_url?: string;
}

export interface ThemeParams {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    header_bg_color: string;
    accent_text_color: string;
    section_bg_color: string;
    section_header_text_color: string;
    subtitle_text_color: string;
    destructive_text_color: string;
}

export interface MainButton {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    hasShineEffect: boolean;

    setText(text: string): MainButton;
    onClick(callback: () => void): MainButton;
    offClick(callback: () => void): MainButton;
    show(): MainButton;
    hide(): MainButton;
    enable(): MainButton;
    disable(): MainButton;
    showProgress(leaveActive?: boolean): MainButton;
    hideProgress(): MainButton;
    setParams(params: MainButtonParams): MainButton;
}

export interface MainButtonParams {
    text?: string;
    color?: string;
    text_color?: string;
    has_shine_effect?: boolean;
    is_active?: boolean;
    is_visible?: boolean;
}

export interface SecondaryButton extends MainButton {
    position: 'left' | 'right' | 'top' | 'bottom';
}

export interface BackButton {
    isVisible: boolean;

    onClick(callback: () => void): BackButton;
    offClick(callback: () => void): BackButton;
    show(): BackButton;
    hide(): BackButton;
}

export interface SettingsButton {
    isVisible: boolean;

    onClick(callback: () => void): SettingsButton;
    offClick(callback: () => void): SettingsButton;
    show(): SettingsButton;
    hide(): SettingsButton;
}

export interface HapticFeedback {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
}

export interface CloudStorage {
    setItem(key: string, value: string, callback?: (err: Error | null, stored?: boolean) => void): void;
    getItem(key: string, callback?: (err: Error | null, value?: string) => void): void;
    getItems(keys: string[], callback?: (err: Error | null, values?: Record<string, string>) => void): void;
    removeItem(key: string, callback?: (err: Error | null, removed?: boolean) => void): void;
    removeItems(keys: string[], callback?: (err: Error | null, removed?: boolean) => void): void;
    getKeys(callback?: (err: Error | null, keys?: string[]) => void): void;
}

export interface BiometricManager {
    isInited: boolean;
    isBiometricAvailable: boolean;
    biometricType: 'finger' | 'face' | 'unknown';
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    isBiometricTokenSaved: boolean;
    deviceId: string;

    init(callback?: () => void): void;
    requestAccess(params: BiometricRequestAccessParams, callback?: (granted: boolean) => void): void;
    authenticate(params: BiometricAuthenticateParams, callback?: (success: boolean, token?: string) => void): void;
    updateBiometricToken(token: string, callback?: (updated: boolean) => void): void;
    openSettings(): void;
}

export interface BiometricRequestAccessParams {
    reason?: string;
}

export interface BiometricAuthenticateParams {
    reason?: string;
}

export interface Accelerometer {
    isStarted: boolean;
    x: number;
    y: number;
    z: number;

    start(params?: { refresh_rate?: number }): void;
    stop(): void;
}

export interface DeviceOrientation {
    isStarted: boolean;
    absolute: boolean;
    alpha: number;
    beta: number;
    gamma: number;

    start(params?: { refresh_rate?: number; need_absolute?: boolean }): void;
    stop(): void;
}

export interface Gyroscope {
    isStarted: boolean;
    x: number;
    y: number;
    z: number;

    start(params?: { refresh_rate?: number }): void;
    stop(): void;
}

export interface LocationManager {
    isInited: boolean;
    isLocationAvailable: boolean;
    isAccessRequested: boolean;
    isAccessGranted: boolean;

    init(callback?: () => void): void;
    getLocation(callback?: (location: LocationData | null) => void): void;
    openSettings(): void;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    altitude?: number;
    course?: number;
    speed?: number;
    horizontal_accuracy?: number;
    vertical_accuracy?: number;
    course_accuracy?: number;
    speed_accuracy?: number;
}

export interface ShareStoryParams {
    text?: string;
    widget_link?: {
        url: string;
        name?: string;
    };
}

export interface DownloadFileParams {
    url: string;
    file_name: string;
}

export interface OpenLinkOptions {
    try_browser?: 'google-chrome' | 'chrome' | 'firefox' | 'safari' | 'opera';
    try_instant_view?: boolean;
}

export interface PopupParams {
    title?: string;
    message: string;
    buttons?: PopupButton[];
}

export interface PopupButton {
    id?: string;
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text?: string;
}

export interface ScanQrPopupParams {
    text?: string;
}

export interface EmojiStatusParams {
    duration?: number;
}

export type ChatType = 'users' | 'bots' | 'groups' | 'channels';

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}