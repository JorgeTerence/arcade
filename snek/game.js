const main = document.querySelector("main");

const SIZE = 7; // calculate based on window width and height;
let direction = [0, 0];

const wait = (t) => new Promise((r) => setTimeout(r, t));
const rand = (n) => Math.round(Math.random() * n);
const pos = ([x, y]) => x + SIZE * y;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const eq = (a, b) => a[0] == b[0] && a[1] == b[1];
const randCoord = () => [rand(SIZE - 1), rand(SIZE - 1)];

const grid = (d) =>
  Array(d ** 2)
    .fill()
    .map(() => document.createElement("i"));

class Queue {
  constructor(value) {
    this.items = value;
  }

  enqueue(item) {
    return this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }
}

class Snake extends Queue {
  constructor(head) {
    super([head]);
    this.head = head;
    this.tail = head;
    main.children.item(pos(head)).classList.add("snake");
  }

  move(coords) {
    this.tail = this.dequeue();
    main.children.item(pos(this.tail)).classList.remove("snake");

    this.enqueue(coords);
    this.head = coords;
    main.children.item(pos(coords)).classList.add("snake");

    console.log(`🐍 ${coords}`);
  }

  grow() {
    this.items.unshift(this.tail);
    main.children.item(pos(this.tail)).classList.add("snake");
  }
}

class Fruit {
  constructor(avoided) {
    this.wander(avoided, true);
  }

  wander(avoided, init = false) {
    if (!init) main.children.item(pos(this.coords)).classList.remove("fruit");

    let next;

    do next = randCoord();
    while (avoided.some((coords) => eq(coords, next)));

    this.coords = next;
    main.children.item(pos(next)).classList.add("fruit");

    console.log(`🍎 ${next}`);

    return next;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  main.append(...grid(SIZE));

  const snake = new Snake(randCoord());
  const fruit = new Fruit(snake.items);

  while (true) {
    const next = add(snake.head, direction);

    const offGrid = next.some((n) => n >= SIZE || n < 0);
    const snakeCrash = snake.items
      .map((c) => c.toString())
      .filter((c) => c != snake.head.toString())
      .includes(next.toString());

    if (offGrid || snakeCrash) {
      alert("Game Over!");
      break;
    }

    snake.move(next);

    if (eq(next, fruit.coords)) {
      snake.grow();
      fruit.wander(snake.items);
    }

    await wait(300);
  }
});

document.addEventListener("keydown", (e) => {
  const directions = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };

  if (e.key.includes("Arrow")) direction = directions[e.key];
});
