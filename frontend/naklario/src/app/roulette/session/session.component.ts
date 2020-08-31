import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  Renderer2,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import {
  RouletteService,
  RouletteRequestType,
  ToastService,
  AppLayoutService,
} from "src/app/_services";
import { Meeting } from "src/app/_models";
import { map } from "rxjs/operators";
import { isPlatformBrowser } from "@angular/common";
import { Router, ActivatedRoute, UrlHandlingStrategy } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExitModalComponent } from "./exit-modal/exit-modal.component";
import { Observable, BehaviorSubject, from } from "rxjs";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "roulette-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() readonly requestType: RouletteRequestType;
  @Input() joinUrl: string;
  @Input() meetingId: string;
  @Output() done = new EventEmitter<Meeting>();
  @ViewChild("iframe") iframe: ElementRef;

  meeting: Meeting;

  // some information about the session state
  hasJoinedAudio: boolean = false;
  isMuted: boolean = true;

  initialLoadStarted: boolean = false;
  initialLoadComplete: boolean = false;

  allowString: string = "";

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private rouletteService: RouletteService,
    private ts: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: AppLayoutService,
    private modalService: NgbModal
  ) {

  }


  ngOnInit(): void {
    const url = new URL(this.joinUrl);
    this.allowString = `microphone ${url.origin}; camera ${url.origin}; geolocation ${url.origin}; display-capture`;
    window.addEventListener("message", (ev) => {
      console.log("got bbb event", ev);
      switch (ev.data.response) {
        case "readyToConnect": {
          this.getInitialState();
        }
        case "joinedAudio": {
          this.hasJoinedAudio = true;
        }
        case "notInAudio": {
          this.hasJoinedAudio = false;
        }
        case "selfMuted": {
          this.isMuted = true;
        }
        case "selfUnmuted": {
          this.isMuted = false;
        }
      }
    });
    console.log("iframe origin: ", url.origin);
    console.log("opening iframe: ", this.joinUrl);
    this.rouletteService.getMeeting(this.meetingId).subscribe(
      (meeting) => {
        this.meeting = meeting;
        if (meeting.ended) {
          this.done.emit(meeting);
        }
      },
      (error) => {
        if (error.status == 404) {
          this.ts.error("Das Meeting konnte nicht gefunden werden!");
        } else {
          this.ts.error(error);
        }
        this.router.navigateByUrl("/");
      }
    );

    this.initialLoadStarted = true;
    this.joinUrl = url.toString();
  }

  getInitialState() {
    // get initial state
    if (isPlatformBrowser(this.platformId)) {
      this.iframe.nativeElement.contentWindow.postMessage(
        "c_recording_status",
        "*"
      );
      this.iframe.nativeElement.contentWindow.postMessage(
        "get_audio_joined_status",
        "*"
      );
    }
  }

  endMeeting() {
    // TODO: Add confirmation? With confirmation -> end meeting/ask other user to end meeting. give feedback!
    from(
      this.modalService.open(ExitModalComponent, { centered: true }).result
    ).subscribe(
      (result) => {
        console.log(result);
        this.rouletteService.endMeeting(this.meeting).subscribe();
        this.done.emit(this.meeting);
      },
      (reason) => {
        console.log("dismissed");
      }
    );
  }

  reloadPage() {
    /*this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route, queryParamsHandling: 'preserve'});*/
    window.location.reload();
  }

  onIFrameLoad() {
    // TODO: catch any kind of bbb redirect.
    // TODO: maybe we can webhook bbb in the API and get all events --> redirect to naklar.io client so it know's
    if (this.initialLoadComplete) {
      console.log("another iframe load started... ending meeting");
      this.done.emit(this.meeting);
    } else if (this.initialLoadStarted) {
      this.initialLoadComplete = !this.initialLoadComplete;
      console.log("initial iframe load!");
    }
  }

  ngAfterViewInit(): void {
    window.scroll(0, 0);
    this.layoutService.setFullscreen(true);
  }

  /**
  // This is kind of hacky and not very performant but works:
  // The idea is to set the iframe height to the remaining viewport height
  // after subtracting its top left position.
  @HostListener("window:resize", ["$event"])
  @HostListener("window:scroll", ["$event"])
  onViewportChange(event) {
    this.onResize(window.innerHeight);
  }
  onResize(innerHeight: number) {
    const height = `${
      innerHeight - this.iframe.nativeElement.getBoundingClientRect().y
    } px`;
    console.log(
      "updating height: ",
      innerHeight,
      this.iframe.nativeElement.getBoundingClientRect(),
      height
    );
    this.iframe.nativeElement.height = height;
  } */

  /**
   * executed after meeting done
   */
  ngOnDestroy(): void {
    // this.rouletteService.deleteMatch(this.requestType);
    //this.layoutService.setScrollable(true);
    this.layoutService.setFullscreen(false);
  }
}
