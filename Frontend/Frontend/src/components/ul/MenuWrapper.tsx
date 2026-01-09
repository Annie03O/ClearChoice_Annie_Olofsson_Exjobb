export type Props = {
    open: boolean;
    closeMenu: () => void;
    children: React.ReactNode;
    title: string;
}

export const MenuWrapper = ({children, title}: Props) => {
    return (
        <section className="bg-white w-full p-2 sm:p-4 text-[#2E3F44] lg:w-fit max-w-full overflow-x-hidden">
            <header className="flex justify-between items-center mb-2">  
             <h2 className="text-lg sm:text-2xl flex-1 break-words">{title}</h2>
           </header>
           <div>
             {children}
           </div>
        </section>
    )
}