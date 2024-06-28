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
