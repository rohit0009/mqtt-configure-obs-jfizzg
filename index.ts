import { concat, EMPTY, forkJoin, interval, merge, of, Subject, timer } from 'rxjs';
import { concatMap, timeout, catchError, delay, tap, takeWhile, filter, map, switchMap, share } from 'rxjs/operators';

// simulate request
function makeRequest(timeToDelay) {
  return of('Request Complete!').pipe(delay(timeToDelay));
}

setTimeout(() => {
  _start.next('START');
  _start.complete();
}, 1000);
let flag1 = 0;
setInterval(() => {
  if (flag1 == 1) {
    _res.next(); _res.complete(); flag1 = flag1 + 1;
  }
}, 900);

let flag2 = 0;
setInterval(() => {
  if (flag2 == 1) {
    _res2.next(); _res2.complete(); flag2 = flag2 + 1;
  }
}, 900);

const _res = new Subject();
const res$ = _res.asObservable().pipe(share());
const s = res$.subscribe()
 
const _res2 = new Subject();
const res2$ = _res2.asObservable().pipe(share());
const s1 = res2$.subscribe();

const _start = new Subject();
const start$ = _start.asObservable();
const req = forkJoin([
  timer(200),
  of(1).pipe(tap(d => {  }))
])
const req2 = forkJoin([
  timer(200),
  of(1).pipe(tap(d => { } ))
])


// of(4000)
//   .pipe(
//     concatMap(duration =>
//       makeRequest(duration).pipe(
//         timeout(2500),
//         catchError(error => of(`Request timed out after: ${duration}`))
//       )
//     )
//   )



let resp = 0;

// interval(1000).pipe(tap(d => console.log(d))).subscribe();

forkJoin([
    start$,
    timer(5000).pipe(tap(d => console.log('TT')))
]).subscribe(d =>
    console.log('TIme')
  );

concat(
  start$,
  req.pipe(map(d => { flag1 = flag1 + 1; return 'reeq' })),
  res$.pipe(map(d => 'res 1')),
  req.pipe(map(d => { flag2 = flag2 + 1; return 'reeq' })),
  res2$.pipe(map(d => 'res 2'))
  
).pipe(
  tap(d => console.log('I', d)),
  filter(d => d != 'START' ),
  filter(d => d != 'reeq' ),
  filter(d => d != 'res 1' ),
  filter(d => d != 'res 2' ),

  // takeWhile(d => resp != 2),
  // tap(d => resp = resp + 1),
  timeout(1500),
  catchError(err => {
    console.log('e')
    return EMPTY;
  })

  
)

  /*
   *  "Request timed out after: 4000"
   *  "Request timed out after: 3000"
   *  "Request Complete!"
   */
  .subscribe(val => console.log('sub',val));
