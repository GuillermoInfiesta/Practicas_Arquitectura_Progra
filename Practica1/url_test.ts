import {assertEquals} from "https://deno.land/std@0.202.0/assert/mod.ts";
import { BubbleSort } from './Ej1.ts';

Deno.test("Test Bubble Sort #1", ()=>{
    const arr = BubbleSort([3,2,4,1]);
    assertEquals(arr, [1,2,3,4]);
});

Deno.test("Test Bubble Sort #2", ()=>{
    const arr = BubbleSort([4,7,9,1,-2,5,0,12,6]);
    assertEquals(arr, [-2,0,1,4,5,6,7,9,12]);
});

Deno.test("Test Bubble Sort #3", ()=>{
    const arr = BubbleSort([10,2,1,56,23,-23,5,-8]);
    assertEquals(arr, [-23,-8,1,2,5,10,23,56]);
});