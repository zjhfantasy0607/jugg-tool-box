// 设置全局的控制侧边栏显示方法
export function ToggleGlobalSidebar() {
    const lgWidth = 1024;
    const windowWidth = window.innerWidth;

    if (windowWidth < lgWidth) {
        const myDrawer = document.getElementById('jugg-global-drawer') as HTMLInputElement;
        myDrawer.checked = !myDrawer.checked;
    }
}

export function GetRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function GetFormattedDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}