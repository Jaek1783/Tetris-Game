// next setting
const next = document.querySelector(".next");
const next_rows = 2;
const next_cols = 4;

function prependNextLine(){
  for (let i = 0; i < new_rows; i++){
    prependNextLine();
  }
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < next_cols; j++){
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
    li.prepend(ul);
    next.prepend(li);
}
