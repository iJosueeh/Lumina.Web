import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEAM_MEMBERS } from '@app/core/constants/team.constants';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.css',
})
export class SobreNosotros implements OnInit {
  teamMembers = TEAM_MEMBERS;
  activeTab: string = 'historia';

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}