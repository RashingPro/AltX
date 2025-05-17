import {useState} from "react";

function ContextTips({input}: {input: string}) {
    return <>
        Вы ввели: {input}
    </>
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