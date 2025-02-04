// Elementos 
const addNote = document.querySelector("#add-note")
const addNoteTextarea = document.querySelector("#add-note textarea")
const addNoteBtn = document.querySelector("#add-note button")

const notescontainer = document.querySelector("#notes")

const searchInput = document.querySelector("#search input")

const exportCsvBtn = document.querySelector("#export-data")

// Funções
const generateID = () => {
    const id = Math.floor(Math.random() * 5000)
    return id
}

const createNote = (id, text, fixed = false, save = true) => {
    if (!id) {
        id = generateID()
    }

    const note = document.createElement("div")
    note.classList.add("note")

    note.setAttribute("note", id)

    const textarea = document.createElement("textarea")
    textarea.value = text

    const trashBtn = document.createElement("button")
    const copyBtn = document.createElement("button")
    const pinBtn = document.createElement("button")

    trashBtn.classList.add("trash-btn")
    copyBtn.classList.add("copy-btn")
    pinBtn.classList.add("pin-btn")

    trashBtn.innerHTML = '<i class="bi bi-trash"></i>'
    copyBtn.innerHTML = '<i class="bi bi-copy"></i>'
    pinBtn.innerHTML = '<i class="bi bi-pin-angle"></i>'

    textarea.addEventListener("change", () => {
        const id = Number(note.getAttribute("note"))
        const text = textarea.value

        textUpdateLS(id, text)
    })

    trashBtn.addEventListener("click", () => {
        removeNoteLS(Number(note.getAttribute("note")))
    })

    copyBtn.addEventListener("click", () => {
        createNote(generateID(), textarea.value, note.classList.contains("fixed"), true)
    })

    pinBtn.addEventListener("click", () => {
        const parent = pinBtn.parentElement
        const noteID = parent.getAttribute("note")

        parent.classList.toggle("fixed")

        switchFixedNoteLS(noteID)
    })

    if (save == true) {
        saveNoteLS(id, text, fixed)
    }

    if (fixed == true) {
        note.classList.add("fixed")
    }

    note.append(textarea, trashBtn, copyBtn, pinBtn)

    note.classList.add("hidden")

    setTimeout(() => {
        note.classList.remove("hidden")
    }, 5)

    notescontainer.prepend(note)
}

const saveNoteLS = (id, text, fixed = false) => {
    const notes = getNotesLS()

    const note = { id, text, isFixed: fixed }

    notes.unshift(note)

    localStorage.setItem("notes", JSON.stringify(notes))
}

const getNotesLS = () => {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")
    return notes
}

const loadNotesLS = () => {
    notescontainer.innerHTML = ""
    let count = 0

    const notes = getNotesLS()

    notes.sort((a, b) => (a.isFixed > b.isFixed ? -1 : 1))

    notes.reverse()

    for (note of notes) {
        console.log(note.text, count)
        count++
        createNote(note.id, note.text, note.isFixed, false)
    }
}

const removeNoteLS = (noteID) => {
    let notes = getNotesLS()

    notes = notes.filter((note) => {
        return note.id !== noteID
    })

    localStorage.setItem("notes", JSON.stringify(notes))
    loadNotesLS()
}

const switchFixedNoteLS = (noteID) => {
    const notes = getNotesLS()

    notes.map((note) => {
        note.id == noteID ? note.isFixed = !note.isFixed : null
    })

    localStorage.setItem("notes", JSON.stringify(notes))
    loadNotesLS()
}

const textUpdateLS = (id, text) => {
    const notes = getNotesLS()

    for (note of notes) {
        if (note.id == id) {
            note.text = text
        }
    }

    localStorage.setItem("notes", JSON.stringify(notes))
    loadNotesLS()
}

const exportCSV = () => {
    const notes = getNotesLS()
    let csv = [["ID", "CONTEÚDO", "FIXADO?"],
    ...notes.map((note) => [note.id, (note.text).replace(`\n`, `\t`), note.isFixed])]
        .map((e) => e.join(","))
        .join("\n")

    console.log(csv)
    const element = document.createElement("a")

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csv)

    element.target = "_blank"

    element.download = "Notes.csv"

    element.click()
}

// Eventos
addNoteBtn.addEventListener("click", (e) => {
    e.preventDefault()

    createNote(null, addNoteTextarea.value)
    addNoteTextarea.value = ""
    addNoteTextarea.focus()
})

document.addEventListener("DOMContentLoaded", (e) => {
    loadNotesLS()
})

searchInput.addEventListener("keyup", (e) => {
    const notes = document.querySelectorAll(".note")
    const text = searchInput.value

    for (note of notes) {
        if (!text) {
            note.classList.remove("hide")
        } else {
            const noteText = (note.querySelector("textarea")).value

            if (noteText.includes(text)) {
                note.classList.remove("hide")
            } else {
                note.classList.add("hide")
            }
        }
    }
})

exportCsvBtn.addEventListener("click", (e) => {
    e.preventDefault()
    exportCSV()
})