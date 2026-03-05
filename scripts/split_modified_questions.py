import os

def main():
    try:
        with open("PREGUNTAS_MODIFICADAS_T1_T8.md", "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("El archivo PREGUNTAS_MODIFICADAS_T1_T8.md no existe.")
        return

    parts = content.split("## Tema T")
    header = parts[0]
    
    for part in parts[1:]:
        topic_num = part.split("\n")[0].strip()
        filename = f"PREGUNTAS_MODIFICADAS_T{topic_num}.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(header + "## Tema T" + part)
            print(f"Creado: {filename}")

if __name__ == "__main__":
    main()
