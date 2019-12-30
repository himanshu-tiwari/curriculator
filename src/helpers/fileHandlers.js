import { isObject, isNonEmptyString } from "./checks";

export const handleSave = async curriculum => {
    const fileName = curriculum.name;
    const json = JSON.stringify(curriculum);
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Saved ${ curriculum.name }.json!`);
};

export const handleFiles = (files, setCurriculum) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const curriculum = JSON.parse(reader.result);
            if (
                isObject(curriculum) &&
                isNonEmptyString(curriculum.name) &&
                isObject(curriculum.standards)
            ) {
                setCurriculum(curriculum);
                alert(`Uploaded standards for ${ curriculum.name }`)
            } else {
                alert("Invalid JSON file!");
            }
        } catch (err) {
            alert("Invalid JSON file!");
        }
    }
    reader.onabort = () => alert('Process aborted!');
    reader.onerror = (e) => alert(e);

    reader.readAsText(files[0]);
};