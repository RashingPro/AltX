import React, {useState} from "react";

function ContextTip(props: {icon: React.ReactNode, title: string, description?: string, onClick: (event: React.MouseEvent<HTMLButtonElement>) => void}) {
    return <button className={`context-tip`} onClick={props.onClick}>
        {props.icon}
        {props.title}
        {props.description}
    </button>
}

interface ContextTipButton {
    icon: React.ReactNode,
    title: (input: string) => string,
    description?: string,
    priority: boolean,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function ContextTips({input}: {input: string}) {
    const lCaseInput = input.toLowerCase();
    const buttons: ContextTipButton[] = [
        {
            icon: <></>,
            title: (inp: string) => `Найти ${inp}`,
            priority: lCaseInput.startsWith("how ") || lCaseInput.startsWith("what ")
        },
        {
            icon: <></>,
            title: (inp: string) => `Перейти на ${inp}`,
            priority: lCaseInput.startsWith("http") || lCaseInput.startsWith("www.") || (!lCaseInput.includes(" ") && lCaseInput.includes(".")),
            onClick: async () => await window.electronApi.openUrl(input)
        },
        {
            icon: <></>,
            title: (inp: string) => `Выполнить ${inp
                .replace("run ", "")
                .replace("bash ", "")
                .replace("cmd ", "")
            }`,
            priority: lCaseInput.startsWith("run ") || lCaseInput.startsWith("bash ") || lCaseInput.startsWith("cmd ")
        }
    ].sort((a) => a.priority ? -1: 1)
    const elements: React.ReactNode[] = buttons.map((btn, i) => {
        return <>
            <ContextTip key={i} icon={<></>} title={btn.title(input)} onClick={btn.onClick} />
        </>
    })

    return <div className={"context-tips"}>
        {elements}
    </div>
}

export default function Main() {
    const [searchInput, setSearchInput] = useState("");

    return <div className={"main-container"}>
        <input
            className={"main-input"}
            placeholder={"Just say a word..."}
            onChange={(event) => setSearchInput(event.target.value)} />
        <ContextTips input={searchInput} />
    </div>
}