import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { Exercise, ExercisePlan, WorkoutPlan } from './model';

@Injectable()
export class WorkoutService {
    public workouts: Array<WorkoutPlan> = [];
    public exercises: Array<Exercise> = [];
    public workout: WorkoutPlan;
    private collectionsUrl = 'https://api.mongolab.com/api/1/databases/personaltrainer/collections';
    private apiKey = '9xfTWt1ilKhqIqzV9Z_8jvCzo5ksjexx';
    private params = '?apiKey=' + this.apiKey;

    constructor(private http: Http) {
    }

    getExercises(){
        return this.http.get(this.collectionsUrl + '/exercises' + this.params)
            .map((res: Response) => <Exercise[]>res.json())
            .catch(this.handleError);
    }

    getExercise(exerciseName: string){
        return this.http.get(this.collectionsUrl + '/exercises/'+ exerciseName  + this.params)
            .map((res: Response) => <Exercise>res.json())
            .catch(this.handleError);
    }

    updateExercise(exercise: Exercise){
        for (var i = 0; i < this.exercises.length; i++) {
            if (this.exercises[i].name === exercise.name) {
                this.exercises[i] = exercise;
            }
        }
        return exercise;
    }

    addExercise(exercise: Exercise){
        if (exercise.name) {
            this.exercises.push(exercise);
            return exercise;
        }
    }

    deleteExercise(exerciseName: string){
        let exerciseIndex: number;
        for (var i = 0; i < this.exercises.length; i++) {
            if (this.exercises[i].name === exerciseName) {
                exerciseIndex = i;
            }
        }
        if (exerciseIndex >= 0) this.exercises.splice(exerciseIndex, 1);
    }

    getWorkouts(){
        return this.http.get(this.collectionsUrl + '/workouts' + this.params)
            .map((res:Response) => <WorkoutPlan[]>res.json())
            .map((workouts:Array<any>) => {
                let result:Array<WorkoutPlan> = [];
                if (workouts) {
                    workouts.forEach((workout) => {
                        result.push(
                            new WorkoutPlan(
                                workout.name,
                                workout.title,
                                workout.restBetweenExercise,
                                workout.exercises,
                                workout.description
                            ));
                    });
                }
                return result;
            })
            .catch(this.handleError);
    }

    getWorkout(workoutName:string) {
        return Observable.forkJoin(
            this.http.get(this.collectionsUrl + '/exercises' + this.params).map((res:Response) => <Exercise[]>res.json()),
            this.http.get(this.collectionsUrl + '/workouts/' + workoutName + this.params).map((res:Response) => <WorkoutPlan>res.json())
        ).map(
            (data:any) => {
                let allExercises = data[0];
                let workout = new WorkoutPlan(
                    data[1].name,
                    data[1].title,
                    data[1].restBetweenExercise,
                    data[1].exercises,
                    data[1].description
                )
                workout.exercises.forEach(
                    (exercisePlan:any) => exercisePlan.exercise = allExercises.find(
                        (x:any) => x.name === exercisePlan.name
                    )
                )
                return workout;
            }
        )
            .catch(this.handleError);
    }

    addWorkout(workout:any) {
        let workoutExercises:any = [];
        workout.exercises.forEach(
            (exercisePlan:any) => {
                workoutExercises.push({name: exercisePlan.exercise.name, duration: exercisePlan.duration})
            }
        );

        let body = JSON.stringify({
            "_id": workout.name,
            "exercises": workoutExercises,
            "name": workout.name,
            "title": workout.title,
            "description": workout.description,
            "restBetweenExercise": workout.restBetweenExercise
        });

        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(this.collectionsUrl + '/workouts' + this.params, body, options)
            .map((res:Response) => res.json())
            .catch(this.handleError)
    }

    updateWorkout(workout:WorkoutPlan) {
        let workoutExercises:any = [];
        workout.exercises.forEach(
            (exercisePlan:any) => {
                workoutExercises.push({name: exercisePlan.exercise.name, duration: exercisePlan.duration})
            }
        );

        let body = JSON.stringify({
            "_id": workout.name,
            "exercises": workoutExercises,
            "name": workout.name,
            "title": workout.title,
            "description": workout.description,
            "restBetweenExercise": workout.restBetweenExercise
        });

        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        return this.http.put(this.collectionsUrl + '/workouts/' + workout.name + this.params, body, options)
            .map((res:Response) => res.json())
            .catch(this.handleError);
    }

    deleteWorkout(workoutName:string) {
        return this.http.delete(this.collectionsUrl + '/workouts/' + workoutName + this.params)
            .map((res:Response) => res.json())
            .catch(this.handleError)
    }

    private handleError(error:Response) {
        console.log(error);
        return Observable.throw(error || 'Server error');
    }
}
