import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Levels from "../views/Levels.vue";
import Level from "../views/Level.vue";
import Stages from "../views/Stages.vue";
import Stage from "../views/Stage.vue";
import Exercises from "../views/Exercises.vue";
import Exercise from "../views/Exercise.vue";
import Lectures from "../views/Lectures.vue";
import Lecture from "../views/Lecture.vue";
import NewLevel from "../views/NewLevel.vue";
import NewStage from "../views/NewStage.vue";
import NewExercise from "../views/NewExercise.vue";
import NewLecture from "../views/NewLecture.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/levels",
    name: "Levels",
    component: Levels,
  },
  {
    path: "/levels/:id",
    name: "Level",
    component: Level,
  },
  {
    path: "/levels/new",
    name: "NewLevel",
    component: NewLevel,
  },
  {
    path: "/stages",
    name: "Stages",
    component: Stages,
  },
  {
    path: "/stages/:id",
    name: "Stage",
    component: Stage,
  },
  {
    path: "/stages/new",
    name: "NewStage",
    component: NewStage,
  },
  {
    path: "/exercises",
    name: "Exercises",
    component: Exercises,
  },
  {
    path: "/exercises/new",
    name: "NewExercise",
    component: NewExercise,
  },
  {
    path: "/exercises/:id",
    name: "Exercise",
    component: Exercise,
  },
  {
    path: "/lectures",
    name: "Lectures",
    component: Lectures,
  },
  {
    path: "/lectures/:id",
    name: "Lecture",
    component: Lecture,
  },
  {
    path: "/lectures/new",
    name: "NewLecture",
    component: NewLecture,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
