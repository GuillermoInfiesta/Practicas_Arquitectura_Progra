import {assertEquals} from "https://deno.land/std@0.202.0/assert/mod.ts";
import { BubbleSort } from './Ej1.ts';
import { SecurityValidator } from './Ej2.ts';
import { TimeConverter } from './Ej3.ts';

//--------Tests Bubblesort------------------
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
//-------------------------------------------

//---------Tests Security Validator----------

Deno.test("Test Security Validator #1", () =>{
    const res = SecurityValidator("deiwq322kdw_ww4=fw");
    assertEquals(res, 1);
})

Deno.test("Test Security Validator #2", () =>{
    const res = SecurityValidator("badPsword");
    assertEquals(res, -1);
})

Deno.test("Test Security Validator #3", () =>{
    const res = SecurityValidator("mwes_2fefe*34s_.03,dw2");
    assertEquals(res, 4);
})
//-------------------------------------------

//----------Tests Time Converter-------------

Deno.test("Test Time Converter #1", () =>{
    const time = TimeConverter("8:57 pm");
    assertEquals(time,"2057")
})

Deno.test("Test Time Converter #2", () =>{
    const time = TimeConverter("13:16 am");
    assertEquals(time,"1316")
})

Deno.test("Test Time Converter #3", () =>{
    const time = TimeConverter("6:43 am");
    assertEquals(time,"0643")
})

Deno.test("Test Time Converter #4", () =>{
    const time = TimeConverter("0:00 pm");
    assertEquals(time,"1200")
})
//-------------------------------------------