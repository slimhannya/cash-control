import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressBarModule } from 'primeng/progressbar';
import { Observable, finalize, map, tap } from 'rxjs';

import { WEB3_CONFIG } from '#web3/config';
import { MetamaskService, Web3State } from '#web3/data-access';
import { Web3Config } from '#web3/models';
import { AddressPipe, NetworkNamePipe } from '#web3/pipes';

const imports = [TranslateModule, ProgressBarModule, ButtonModule, AddressPipe, ConfirmPopupModule, NetworkNamePipe, AsyncPipe];

@UntilDestroy()
@Component({
  selector: 'ctrl-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports,
})
export class WalletComponent {
  private readonly web3State: Web3State = inject(Web3State);
  private readonly metamaskService: MetamaskService = inject(MetamaskService);

  protected web3Config: Web3Config = inject(WEB3_CONFIG);

  public readonly chainId$: Observable<string | null> = this.web3State.chainId$;
  public readonly isProcessing$: Observable<boolean> = this.web3State.isProcessing$;
  public readonly account$: Observable<string | null> = this.web3State.walletAddress$;
  public readonly isMetamaskInstalled$: Observable<boolean> = this.web3State.isWalletExtention$;

  public readonly PrimeIcons: typeof PrimeIcons = PrimeIcons;

  public connectWallet(): void {
    this.web3State.setIsProcessing(true);

    this.metamaskService
      .requestWallets$()
      .pipe(
        map((walletAddresses: string[]) => walletAddresses[0]),
        tap((walletAddress) => this.web3State.setWalletAddress(walletAddress)),
        finalize((): void => this.web3State.setIsProcessing(false)),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
