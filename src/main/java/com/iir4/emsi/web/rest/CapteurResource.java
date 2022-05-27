package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.domain.Capteur;
import com.iir4.emsi.repository.CapteurRepository;
import com.iir4.emsi.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.iir4.emsi.domain.Capteur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CapteurResource {

    private final Logger log = LoggerFactory.getLogger(CapteurResource.class);

    private static final String ENTITY_NAME = "capteur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CapteurRepository capteurRepository;

    public CapteurResource(CapteurRepository capteurRepository) {
        this.capteurRepository = capteurRepository;
    }

    /**
     * {@code POST  /capteurs} : Create a new capteur.
     *
     * @param capteur the capteur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new capteur, or with status {@code 400 (Bad Request)} if the capteur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/capteurs")
    public ResponseEntity<Capteur> createCapteur(@RequestBody Capteur capteur) throws URISyntaxException {
        log.debug("REST request to save Capteur : {}", capteur);
        if (capteur.getId() != null) {
            throw new BadRequestAlertException("A new capteur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Capteur result = capteurRepository.save(capteur);
        return ResponseEntity
            .created(new URI("/api/capteurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /capteurs/:id} : Updates an existing capteur.
     *
     * @param id the id of the capteur to save.
     * @param capteur the capteur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated capteur,
     * or with status {@code 400 (Bad Request)} if the capteur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the capteur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/capteurs/{id}")
    public ResponseEntity<Capteur> updateCapteur(@PathVariable(value = "id", required = false) final Long id, @RequestBody Capteur capteur)
        throws URISyntaxException {
        log.debug("REST request to update Capteur : {}, {}", id, capteur);
        if (capteur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, capteur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!capteurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Capteur result = capteurRepository.save(capteur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, capteur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /capteurs/:id} : Partial updates given fields of an existing capteur, field will ignore if it is null
     *
     * @param id the id of the capteur to save.
     * @param capteur the capteur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated capteur,
     * or with status {@code 400 (Bad Request)} if the capteur is not valid,
     * or with status {@code 404 (Not Found)} if the capteur is not found,
     * or with status {@code 500 (Internal Server Error)} if the capteur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/capteurs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Capteur> partialUpdateCapteur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Capteur capteur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Capteur partially : {}, {}", id, capteur);
        if (capteur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, capteur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!capteurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Capteur> result = capteurRepository
            .findById(capteur.getId())
            .map(existingCapteur -> {
                if (capteur.getType() != null) {
                    existingCapteur.setType(capteur.getType());
                }
                if (capteur.getReference() != null) {
                    existingCapteur.setReference(capteur.getReference());
                }
                if (capteur.getPhoto() != null) {
                    existingCapteur.setPhoto(capteur.getPhoto());
                }
                if (capteur.getPhotoContentType() != null) {
                    existingCapteur.setPhotoContentType(capteur.getPhotoContentType());
                }
                if (capteur.getFrequence() != null) {
                    existingCapteur.setFrequence(capteur.getFrequence());
                }

                return existingCapteur;
            })
            .map(capteurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, capteur.getId().toString())
        );
    }

    /**
     * {@code GET  /capteurs} : get all the capteurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of capteurs in body.
     */
    @GetMapping("/capteurs")
    public List<Capteur> getAllCapteurs() {
        log.debug("REST request to get all Capteurs");
        return capteurRepository.findAll();
    }
    
    @GetMapping("/capteurs/boitier/{id}")
    public List<Capteur> getByBoitier(@PathVariable Long id) {
        log.debug("REST request to get all Capteurs");
        return capteurRepository.getByBoitier(id);
    }
   

    /**
     * {@code GET  /capteurs/:id} : get the "id" capteur.
     *
     * @param id the id of the capteur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the capteur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/capteurs/{id}")
    public ResponseEntity<Capteur> getCapteur(@PathVariable Long id) {
        log.debug("REST request to get Capteur : {}", id);
        Optional<Capteur> capteur = capteurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(capteur);
    }

    /**
     * {@code DELETE  /capteurs/:id} : delete the "id" capteur.
     *
     * @param id the id of the capteur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/capteurs/{id}")
    public ResponseEntity<Void> deleteCapteur(@PathVariable Long id) {
        log.debug("REST request to delete Capteur : {}", id);
        capteurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
