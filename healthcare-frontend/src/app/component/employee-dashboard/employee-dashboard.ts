import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router'

@Component({
    selector: 'app-employee-dashboard',
    imports: [ CommonModule, FormsModule],
    templateUrl: './employee-dashboard.html',
    styleUrl: './employee-dashboard.css',

})
export class EmployeeDashboard implements OnInit{
    employeeData = signal<any>(null);

    constructor ( public userService: UserService, private router:Router) {}

    ngOnInit(): void {
        this.userService.getMe().subscribe({
            next: (data) => {
                this.employeeData.set(data);
                console.log(data);
            },
            error: (err) => {
                console.log('Error getting user: ', err);
            }
        });
    }
}