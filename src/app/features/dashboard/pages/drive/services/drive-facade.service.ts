import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, switchMap } from 'rxjs';

import { IUser } from '#auth/models';
import { AuthSelectors } from '#auth/store';
import { AppPaths } from '#core/enums';
import { DashobardPaths } from '#dashboard/enums';
import { FileUploadPayload, FolderUploadPayload, IFile } from '#drive/models';
import { DriveService } from '#drive/services';
import { DriveActions, DriveSelectors } from '#drive/store';

@Injectable()
export class DriveFacadeService {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly driveService = inject(DriveService);

  get files$(): Observable<IFile[]> {
    return this.parentId$.pipe(
      switchMap((parentId: string) => {
        return this.store.select(DriveSelectors.files).pipe(map((files) => this.driveService.filterFiles(files, parentId)));
      })
    );
  }

  get isLoading$(): Observable<boolean> {
    return this.store.select(DriveSelectors.isLoading);
  }

  get isProcessing$(): Observable<boolean> {
    return this.store.select(DriveSelectors.isProcessing);
  }

  get user$(): Observable<IUser | null> {
    return this.store.select(AuthSelectors.user);
  }

  get parentId$(): Observable<string> {
    return this.driveService.parentId$;
  }

  get parentFile$(): Observable<IFile | undefined> {
    return this.parentId$.pipe(switchMap((id) => this.store.select(DriveSelectors.fileById(id))));
  }

  getFolderDetails$(fileId: string): Observable<IFile | undefined> {
    return this.store.select(DriveSelectors.fileById(fileId));
  }

  setParentId(id: string): void {
    this.driveService.setParentId(id);
  }

  uploadFile(payload: FileUploadPayload): void {
    this.store.dispatch(DriveActions.uploadFile({ payload }));
  }

  uploadFolder(payload: FolderUploadPayload): void {
    this.store.dispatch(DriveActions.uploadFolder({ payload }));
  }

  fileClick(file: IFile): void {
    if (file.type === 'file') {
      window.open(file.url);
    } else {
      this.router.navigate([AppPaths.DASHBOARD, DashobardPaths.DRIVE, file.id]);
    }
  }
}
