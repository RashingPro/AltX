import React, {useState} from "react";

function ContextTip(props: {icon: React.ReactNode, title: string, description?: string}) {
    return <button className={`context-tip`}>
        {props.icon}
        {props.title}
        {props.description}
    </button>
}

interface ContextTipButton {
    icon: React.ReactNode,
    title: string,
    description?: string,
    priority: boolean
}

function ContextTips({input}: {input: string}) {
    const lCaseInput = input.toLowerCase();
    const buttons: ContextTipButton[] = [
        {
            icon: <></>,
            title: "Найти $1",
            priority: lCaseInput.startsWith("how ") || lCaseInput.startsWith("what ")
        },
        {
            icon: <></>,
            title: "Перейти на $1",
            priority: lCaseInput.startsWith("http") || lCaseInput.startsWith("www.") || (!lCaseInput.includes(" ") && lCaseInput.includes("."))
        },
        {
            icon: <></>,
            title: "Выполнить $1",
            priority: lCaseInput.startsWith("run") || lCaseInput.startsWith("bash")
        }
    ].sort((a, b) => a.priority ? -1: 1)
    const elements: React.ReactNode[] = buttons.map((btn, i) => {
        return <>
            <ContextTip key={i} icon={<></>} title={btn.title.replace("$1", input)}/>
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