import json
import re

from bs4 import BeautifulSoup


def parse_p(tag):
    print(" ******* ")
    text = re.sub(r"\s+", " ", tag.text).strip()

    num, question = re.split(r"[\.\s]+", text, maxsplit=1)
    num = num.strip()
    question = question.strip()

    print(f"{num}) {question}")

    return {"id": int(num), "text": question}

def parse_ul(tag):
    # print("TAG ul")
    answers = []
    id = 0
    for child in tag.descendants:
        # print(child)
        if child.name == "p":
            is_correct = "#fff" not in child["style"]
            mark = "!" if is_correct else ""

            text = re.sub(r"\s+", " ", child.text).strip()
            print(f"{mark}   {text}")


            id += 1
            answers.append({"id": id, "is_correct": is_correct, "text": text})

    return answers


if __name__ == "__main__":
    with open("input.html") as fp:
        soup = BeautifulSoup(fp, 'html.parser')

    items = []

    question = answers = None
    for child in soup.body.children:

        if child.name == "p":
            question = parse_p(child)

        if child.name == "ul":
            answers = parse_ul(child)

        if question and answers:
            items.append({"question": question, "answers": answers})
            question = answers = None


    with open("result.json", "w") as fp:
        fp.write(json.dumps(items))

    print(f'{len(items)} have been written')

