import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FOOTER_CONTACT_INFO,
  FOOTER_LEGAL_LINKS,
  FOOTER_SECTIONS,
  FOOTER_SOCIAL_LINKS,
} from '@app/core/constants/footer.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  footerSections = FOOTER_SECTIONS;
  legalLinks = FOOTER_LEGAL_LINKS;
  socialLinks = FOOTER_SOCIAL_LINKS;
  contactInfo = FOOTER_CONTACT_INFO;
}