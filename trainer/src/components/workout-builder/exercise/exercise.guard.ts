import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable} from "rxjs/Rx";

import {Exercise} from "../../../services/model";
import {WorkoutService} from "../../../services/workout-service";

@Injectable()
export class ExerciseGuard implements CanActivate {
    private exercise:Exercise;
    private sub:any;

    constructor(private workoutService:WorkoutService,
                private router:Router) {
    }

    canActivate(route:ActivatedRouteSnapshot):Observable<boolean> {
        let exerciseName = route.params['id'];
        return this.workoutService.getExercise(exerciseName)
            .take(1)
            .map(exercise => !!exercise)
            .do(exerciseExists => {
                if (!exerciseExists)  this.router.navigate(['/builder/exercises']);
            })
            .catch(error => {
                    if (error.status === 404) {
                        this.router.navigate(['/builder/exercises']);
                        return Observable.of(false)
                    } else {
                        return Observable.throw(error);
                    }
                }
            )
    }
}
