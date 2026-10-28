function tinhtong(a : number,b:number):number {
    return a + b;
}

function sumArray(ds: number[]) : number{
    return ds.reduce((pre, present)=> pre + present,0);
}

function createEmail(user:string):string{
    return `sale_${user}@example.com`;
}

function eightcharacter (ds: string[]) : string{
   const eight = ds.filter(item => item.length > 8);
   return eight.join(', ');
}
console.log(sumArray([1,2,3,4,5,6]))
console.log(tinhtong(1,2))
console.log(createEmail("diep"))
console.log(eightcharacter(['Mua sữa', 'Học Playwright', 'Đi chợ', 'nấu cơm tối nay']));