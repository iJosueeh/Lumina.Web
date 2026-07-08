import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '@app/core/models/course.model';
import { CursosService } from '@app/core/services/cursos.service';
import { ErrorMessageComponent } from '@app/shared/components/error-message/error-message';
import { scrollToTop } from '@shared/utils/form.utils';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ErrorMessageComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  cursosService = inject(CursosService);
  private cdr = inject(ChangeDetectorRef);

  allCourses: Course[] = [];
  visibleCourses: Course[] = [];
  featuredCourses: Course[] = [];

  ngOnInit(): void {
    scrollToTop();
    this.loadCourses();
  }

  loadCourses(): void {
    this.cursosService.getAllCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses;
        this.featuredCourses = courses.slice(0, 3);
        this.visibleCourses = courses.slice(0, 6);
        this.cdr.markForCheck();
      },
      error: () => {
        this.allCourses = [];
        this.featuredCourses = [];
        this.visibleCourses = [];
        this.cdr.markForCheck();
      }
    });
  }
}