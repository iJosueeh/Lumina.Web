import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  data: any;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL = 5 * 60 * 1000;

export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  const cached = cache.get(req.urlWithParams);
  const now = Date.now();

  if (cached && cached.expiry > now) {
    return next(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cache.set(req.urlWithParams, {
            data: event.body,
            expiry: now + DEFAULT_TTL
          });
        }
      })
    );
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        let ttl = DEFAULT_TTL;
        
        if (req.url.includes('/categorias') || req.url.includes('/niveles')) {
          ttl = 30 * 60 * 1000;
        } else if (req.url.includes('/noticias')) {
          ttl = 2 * 60 * 1000;
        }
        
        cache.set(req.urlWithParams, {
          data: event.body,
          expiry: now + ttl
        });
      }
    })
  );
};

export function clearCache(): void {
  cache.clear();
}
